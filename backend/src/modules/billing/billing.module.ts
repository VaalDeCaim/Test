import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserProfile,
  Balance,
  Subscription,
  SubscriptionHistory,
  CoinTransaction,
} from '../../entities';
import { UsersController } from './users.controller';
import { BillingService } from './billing.service';
import { StripeService } from './stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserProfile,
      Balance,
      Subscription,
      SubscriptionHistory,
      CoinTransaction,
    ]),
  ],
  controllers: [UsersController],
  providers: [BillingService, StripeService],
  exports: [BillingService],
})
export class BillingModule {}
