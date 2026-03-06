import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('balances')
export class Balance {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ type: 'integer', default: 0 })
  coins: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
