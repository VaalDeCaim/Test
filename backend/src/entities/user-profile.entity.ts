import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'stripe_customer_id', nullable: true })
  stripeCustomerId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
