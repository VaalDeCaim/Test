import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserProfile,
  Balance,
  Subscription,
  SubscriptionHistory,
  CoinTransaction,
} from '../../entities';
import {
  SubscriptionPlan,
  SubscriptionStatus,
  CoinTransactionType,
} from '../../entities';
import { StripeService, COIN_PACKAGES } from './stripe.service';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,
    @InjectRepository(Balance)
    private readonly balanceRepo: Repository<Balance>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(SubscriptionHistory)
    private readonly historyRepo: Repository<SubscriptionHistory>,
    @InjectRepository(CoinTransaction)
    private readonly transactionRepo: Repository<CoinTransaction>,
    private readonly stripe: StripeService,
    private readonly config: ConfigService,
  ) {}

  async getOrCreateProfile(
    userId: string,
    email?: string,
  ): Promise<UserProfile> {
    let profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) {
      profile = this.profileRepo.create({ userId });
      if (email) {
        try {
          const customerId = await this.stripe.createCustomer(email, userId);
          profile.stripeCustomerId = customerId;
        } catch {
          // Stripe not configured or failed - profile works without customer
        }
      }
      await this.profileRepo.save(profile);
      await this.ensureBalance(userId);
      await this.ensureSubscription(userId);
    }
    return profile;
  }

  private async ensureBalance(userId: string): Promise<void> {
    const existing = await this.balanceRepo.findOne({ where: { userId } });
    if (!existing) {
      await this.balanceRepo.save(
        this.balanceRepo.create({ userId, coins: 0 }),
      );
    }
  }

  private async ensureSubscription(userId: string): Promise<void> {
    const existing = await this.subscriptionRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    if (!existing) {
      await this.subscriptionRepo.save(
        this.subscriptionRepo.create({
          userId,
          plan: SubscriptionPlan.FREE,
          status: SubscriptionStatus.ACTIVE,
        }),
      );
    }
  }

  async getBalance(userId: string): Promise<number> {
    await this.ensureBalance(userId);
    const balance = await this.balanceRepo.findOne({ where: { userId } });
    return balance?.coins ?? 0;
  }

  async getSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getSubscriptionHistory(userId: string): Promise<SubscriptionHistory[]> {
    return this.historyRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getCoinTransactions(userId: string): Promise<CoinTransaction[]> {
    return this.transactionRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async createTopUpCheckout(
    userId: string,
    packageId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ url: string; sessionId: string }> {
    const profile = await this.getOrCreateProfile(userId);
    if (!profile.stripeCustomerId) {
      throw new BadRequestException(
        'Stripe customer not set. Complete profile first.',
      );
    }
    return this.stripe.createCheckoutForCoins(
      profile.stripeCustomerId,
      packageId,
      successUrl,
      cancelUrl,
    );
  }

  async createProCheckout(
    userId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ url: string; sessionId: string }> {
    const profile = await this.getOrCreateProfile(userId);
    if (!profile.stripeCustomerId) {
      throw new BadRequestException(
        'Stripe customer not set. Complete profile first.',
      );
    }
    return this.stripe.createCheckoutForPro(
      profile.stripeCustomerId,
      successUrl,
      cancelUrl,
    );
  }

  async handleCheckoutCompleted(session: {
    id: string;
    customer: string;
    metadata?: { type?: string; packageId?: string; coins?: string };
  }): Promise<void> {
    const type = session.metadata?.type;
    if (type === 'coin_purchase' && session.metadata?.coins) {
      const coins = parseInt(session.metadata.coins, 10);
      const profile = await this.profileRepo.findOne({
        where: { stripeCustomerId: session.customer },
      });
      if (profile) {
        await this.addCoins(
          profile.userId,
          coins,
          CoinTransactionType.PURCHASE,
          session.id,
        );
      }
    }
  }

  async addCoins(
    userId: string,
    amount: number,
    type: CoinTransactionType,
    stripePaymentIntentId?: string,
    reference?: string,
  ): Promise<void> {
    await this.ensureBalance(userId);
    await this.balanceRepo.increment({ userId }, 'coins', amount);
    await this.transactionRepo.save(
      this.transactionRepo.create({
        userId,
        type,
        amount,
        stripePaymentIntentId: stripePaymentIntentId ?? null,
        reference,
      }),
    );
  }

  async deductCoins(
    userId: string,
    amount: number,
    reference: string,
  ): Promise<boolean> {
    const balance = await this.getBalance(userId);
    if (balance < amount) return false;
    await this.balanceRepo.decrement({ userId }, 'coins', amount);
    await this.transactionRepo.save(
      this.transactionRepo.create({
        userId,
        type: CoinTransactionType.USAGE,
        amount: -amount,
        reference,
      }),
    );
    return true;
  }

  async handleSubscriptionUpdated(subscription: {
    id: string;
    customer: string;
    status: string;
    current_period_end: number;
  }): Promise<void> {
    const profile = await this.profileRepo.findOne({
      where: { stripeCustomerId: subscription.customer },
    });
    if (!profile) return;

    let sub = await this.subscriptionRepo.findOne({
      where: { stripeSubscriptionId: subscription.id },
    });
    if (sub) {
      sub.status = this.mapStripeStatus(subscription.status);
      sub.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      await this.subscriptionRepo.save(sub);
    } else {
      sub = await this.subscriptionRepo.save(
        this.subscriptionRepo.create({
          userId: profile.userId,
          stripeSubscriptionId: subscription.id,
          plan: SubscriptionPlan.PRO,
          status: this.mapStripeStatus(subscription.status),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        }),
      );
    }

    await this.historyRepo.save(
      this.historyRepo.create({
        userId: profile.userId,
        event: 'subscription_updated',
        plan: SubscriptionPlan.PRO,
        stripeEventId: subscription.id,
      }),
    );
  }

  private mapStripeStatus(status: string): SubscriptionStatus {
    switch (status) {
      case 'active':
      case 'trialing':
        return SubscriptionStatus.ACTIVE;
      case 'canceled':
      case 'unpaid':
        return SubscriptionStatus.CANCELED;
      case 'past_due':
        return SubscriptionStatus.PAST_DUE;
      default:
        return SubscriptionStatus.ACTIVE;
    }
  }

  getCoinPackages(): Record<string, { coins: number; priceCents: number }> {
    return { ...COIN_PACKAGES };
  }

  getPricing(): {
    operations: Array<{
      id: string;
      name: string;
      description: string;
      coins: number;
    }>;
    coinPackages: Array<{
      id: string;
      coins: number;
      priceCents: number;
      priceUsd: string;
    }>;
    proSubscription: {
      priceCents: number;
      priceUsd: string;
      interval: string;
    } | null;
  } {
    const packages = this.getCoinPackages();
    const proPriceCents = parseInt(
      this.config.get<string>('PRO_PRICE_CENTS', '0'),
      10,
    );
    const proInterval = this.config.get<string>('PRO_PRICE_INTERVAL', 'month');

    return {
      operations: [
        {
          id: 'conversion',
          name: 'Bank statement conversion',
          description: 'MT940 or CAMT.053 to CSV/XLSX/QBO',
          coins: 1,
        },
      ],
      coinPackages: Object.entries(packages).map(([id, pkg]) => ({
        id,
        coins: pkg.coins,
        priceCents: pkg.priceCents,
        priceUsd: (pkg.priceCents / 100).toFixed(2),
      })),
      proSubscription: proPriceCents
        ? {
            priceCents: proPriceCents,
            priceUsd: (proPriceCents / 100).toFixed(2),
            interval: proInterval,
          }
        : null,
    };
  }

  async hasProAccess(userId: string): Promise<boolean> {
    const sub = await this.getSubscription(userId);
    if (!sub) return false;
    if (sub.plan !== SubscriptionPlan.PRO) return false;
    if (sub.status !== SubscriptionStatus.ACTIVE) return false;
    if (sub.currentPeriodEnd && sub.currentPeriodEnd < new Date()) return false;
    return true;
  }
}
