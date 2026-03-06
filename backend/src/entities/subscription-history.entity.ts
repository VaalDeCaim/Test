import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('subscription_history')
export class SubscriptionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  event: string;

  @Column({ nullable: true })
  plan: string | null;

  @Column({ name: 'stripe_event_id', nullable: true })
  stripeEventId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
