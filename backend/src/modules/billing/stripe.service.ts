import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export const COIN_PACKAGES: Record<
  string,
  { coins: number; priceCents: number }
> = {
  small: { coins: 50, priceCents: 500 },
  medium: { coins: 200, priceCents: 1500 },
  large: { coins: 500, priceCents: 3500 },
};

@Injectable()
export class StripeService {
  private readonly stripe: Stripe | null;
  private readonly webhookSecret: string;
  private readonly proPriceId: string;

  constructor(private config: ConfigService) {
    const key = this.config.get<string>('STRIPE_SECRET_KEY');
    this.stripe = key ? new Stripe(key) : null;
    this.webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET', '');
    this.proPriceId = this.config.get<string>('STRIPE_PRO_PRICE_ID', '');
  }

  private ensureStripe(): Stripe {
    if (!this.stripe) throw new Error('STRIPE_SECRET_KEY is not configured');
    return this.stripe;
  }

  async createCustomer(email: string, userId: string): Promise<string> {
    const stripe = this.ensureStripe();
    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    });
    return customer.id;
  }

  async createCheckoutForCoins(
    customerId: string,
    packageId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ url: string; sessionId: string }> {
    const pkg = COIN_PACKAGES[packageId];
    if (!pkg) throw new Error(`Unknown package: ${packageId}`);

    const session = await this.ensureStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${pkg.coins} Coins`,
              description: `Top-up ${pkg.coins} coins for bank statement conversions`,
            },
            unit_amount: pkg.priceCents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        type: 'coin_purchase',
        packageId,
        coins: String(pkg.coins),
      },
    });

    if (!session.url) throw new Error('Failed to create checkout URL');
    return { url: session.url, sessionId: session.id };
  }

  async createCheckoutForPro(
    customerId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ url: string; sessionId: string }> {
    if (!this.proPriceId) throw new Error('STRIPE_PRO_PRICE_ID not configured');

    const session = await this.ensureStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: this.proPriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { type: 'pro_subscription' },
    });

    if (!session.url) throw new Error('Failed to create checkout URL');
    return { url: session.url, sessionId: session.id };
  }

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.ensureStripe().webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret,
    );
  }

  getClient(): Stripe | null {
    return this.stripe;
  }

  getWebhookSecret(): string {
    return this.webhookSecret;
  }
}
