import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum CoinTransactionType {
  PURCHASE = 'purchase',
  USAGE = 'usage',
  REFUND = 'refund',
}

@Entity('coin_transactions')
export class CoinTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: CoinTransactionType,
  })
  type: CoinTransactionType;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ name: 'stripe_payment_intent_id', nullable: true })
  stripePaymentIntentId: string | null;

  @Column({ nullable: true })
  reference: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
