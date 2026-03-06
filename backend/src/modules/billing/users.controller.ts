import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ScopesGuard } from '../../common/guards/scopes.guard';
import { Scopes } from '../../common/decorators/scopes.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { BillingService } from './billing.service';
import { StripeService } from './stripe.service';
import { TopUpDto } from './dto/topup.dto';
import { ProCheckoutDto } from './dto/checkout.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly billing: BillingService,
    private readonly stripe: StripeService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, ScopesGuard)
  @Scopes('jobs:read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile with balance and subscription' })
  async getMe(
    @Req() req: { user: { sub: string; email?: string; name?: string } },
  ) {
    const userId = req.user.sub;
    const [profile, balance, subscription] = await Promise.all([
      this.billing.getOrCreateProfile(userId, req.user.email),
      this.billing.getBalance(userId),
      this.billing.getSubscription(userId),
    ]);
    return {
      sub: req.user.sub,
      email: req.user.email,
      name: req.user.name,
      stripeCustomerId: profile.stripeCustomerId,
      balance: { coins: balance },
      subscription: subscription
        ? {
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
          }
        : null,
    };
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard, ScopesGuard)
  @Scopes('jobs:read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get coins balance' })
  async getBalance(@Req() req: { user: { sub: string } }) {
    const coins = await this.billing.getBalance(req.user.sub);
    return { coins };
  }

  @Post('topup')
  @UseGuards(JwtAuthGuard, ScopesGuard)
  @Scopes('jobs:write')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe checkout for coins' })
  async topUp(
    @Req() req: { user: { sub: string; email?: string } },
    @Body() dto: TopUpDto,
  ) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const successUrl = dto.successUrl || `${baseUrl}/billing/success`;
    const cancelUrl = dto.cancelUrl || `${baseUrl}/billing`;
    return this.billing.createTopUpCheckout(
      req.user.sub,
      dto.packageId,
      successUrl,
      cancelUrl,
    );
  }

  @Post('subscription/checkout')
  @UseGuards(JwtAuthGuard, ScopesGuard)
  @Scopes('jobs:write')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe checkout for Pro subscription' })
  async proCheckout(
    @Req() req: { user: { sub: string; email?: string } },
    @Body() dto: ProCheckoutDto,
  ) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const successUrl = dto.successUrl || `${baseUrl}/billing/success`;
    const cancelUrl = dto.cancelUrl || `${baseUrl}/billing`;
    return this.billing.createProCheckout(req.user.sub, successUrl, cancelUrl);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard, ScopesGuard)
  @Scopes('jobs:read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current subscription' })
  async getSubscription(@Req() req: { user: { sub: string } }) {
    const subscription = await this.billing.getSubscription(req.user.sub);
    return subscription ?? { plan: 'free', status: 'active' };
  }

  @Get('subscription/history')
  @UseGuards(JwtAuthGuard, ScopesGuard)
  @Scopes('jobs:read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscription history' })
  async getSubscriptionHistory(@Req() req: { user: { sub: string } }) {
    return this.billing.getSubscriptionHistory(req.user.sub);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard, ScopesGuard)
  @Scopes('jobs:read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get coin transaction history' })
  async getTransactions(@Req() req: { user: { sub: string } }) {
    return this.billing.getCoinTransactions(req.user.sub);
  }

  @Get('packages')
  @UseGuards(JwtAuthGuard, ScopesGuard)
  @Scopes('jobs:read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available coin packages' })
  getPackages() {
    const packages = this.billing.getCoinPackages();
    return Object.entries(packages).map(([id, pkg]) => ({
      id,
      coins: pkg.coins,
      priceCents: pkg.priceCents,
      priceUsd: (pkg.priceCents / 100).toFixed(2),
    }));
  }

  @Get('pricing')
  @Public()
  @ApiOperation({ summary: 'Get prices per operation (public)' })
  getPricing() {
    return this.billing.getPricing();
  }

  @Post('stripe/webhook')
  @Public()
  @ApiOperation({ summary: 'Stripe webhook (internal)' })
  async stripeWebhook(@Req() req: RawBodyRequest<Request>) {
    const rawBody = req.rawBody;
    const signature = req.headers['stripe-signature'] as string;
    if (!rawBody || !signature) {
      return { received: false };
    }
    if (!this.stripe.getWebhookSecret()) {
      throw new HttpException('Webhook not configured', 503);
    }

    try {
      const event = this.stripe.constructWebhookEvent(rawBody, signature);
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as {
            id: string;
            customer: string;
            metadata?: Record<string, string>;
          };
          await this.billing.handleCheckoutCompleted(session);
          break;
        }
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const sub = event.data.object as unknown as {
            id: string;
            customer: string;
            status: string;
            current_period_end: number;
          };
          await this.billing.handleSubscriptionUpdated(sub);
          break;
        }
        default:
          break;
      }
      return { received: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('signature') || msg.includes('Webhook')) {
        throw new HttpException('Webhook signature verification failed', 401);
      }
      throw err;
    }
  }
}
