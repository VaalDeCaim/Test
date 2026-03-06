import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddValidationReportAndRetention1730830000000 implements MigrationInterface {
  name = 'AddValidationReportAndRetention1730830000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "jobs"
      ADD COLUMN "validation_errors" jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN "validation_warnings" jsonb DEFAULT '[]'::jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "jobs"
      DROP COLUMN "validation_errors",
      DROP COLUMN "validation_warnings"
    `);
  }
}
