import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBillingTables1730820000000 implements MigrationInterface {
  name = 'CreateBillingTables1730820000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_profiles" (
        "user_id" character varying NOT NULL,
        "stripe_customer_id" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_profiles" PRIMARY KEY ("user_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "balances" (
        "user_id" character varying NOT NULL,
        "coins" integer NOT NULL DEFAULT 0,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_balances" PRIMARY KEY ("user_id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "subscriptions_plan_enum" AS ENUM ('free', 'pro');
      CREATE TYPE "subscriptions_status_enum" AS ENUM ('active', 'canceled', 'past_due', 'trialing');
    `);

    await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" character varying NOT NULL,
        "stripe_subscription_id" character varying,
        "plan" "subscriptions_plan_enum" NOT NULL DEFAULT 'free',
        "status" "subscriptions_status_enum" NOT NULL DEFAULT 'active',
        "current_period_end" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_subscriptions" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "subscription_history" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" character varying NOT NULL,
        "event" character varying NOT NULL,
        "plan" character varying,
        "stripe_event_id" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_subscription_history" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "coin_transactions_type_enum" AS ENUM ('purchase', 'usage', 'refund');
    `);

    await queryRunner.query(`
      CREATE TABLE "coin_transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" character varying NOT NULL,
        "type" "coin_transactions_type_enum" NOT NULL,
        "amount" integer NOT NULL,
        "stripe_payment_intent_id" character varying,
        "reference" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_coin_transactions" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "coin_transactions"`);
    await queryRunner.query(`DROP TYPE "coin_transactions_type_enum"`);
    await queryRunner.query(`DROP TABLE "subscription_history"`);
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TYPE "subscriptions_status_enum"`);
    await queryRunner.query(`DROP TYPE "subscriptions_plan_enum"`);
    await queryRunner.query(`DROP TABLE "balances"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
  }
}
