import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToTables1773600000000 implements MigrationInterface {
  name = 'AddUserIdToTables1773600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove seeded credit cards (they have no owner)
    await queryRunner.query(`DELETE FROM \`transaction\``);
    await queryRunner.query(`DELETE FROM \`credit_card\``);

    // expense
    await queryRunner.query(
      `ALTER TABLE \`expense\` ADD \`userId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_expense_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE`,
    );

    // income
    await queryRunner.query(
      `ALTER TABLE \`income\` ADD \`userId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` ADD CONSTRAINT \`FK_income_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE`,
    );

    // month
    await queryRunner.query(
      `ALTER TABLE \`month\` ADD \`userId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`month\` ADD CONSTRAINT \`FK_month_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE`,
    );

    // credit_card
    await queryRunner.query(
      `ALTER TABLE \`credit_card\` ADD \`userId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`credit_card\` ADD CONSTRAINT \`FK_credit_card_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE`,
    );

    // transaction (nullable — queue-based events may not have a user)
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`userId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_transaction_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_transaction_user\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP COLUMN \`userId\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`credit_card\` DROP FOREIGN KEY \`FK_credit_card_user\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`credit_card\` DROP COLUMN \`userId\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`month\` DROP FOREIGN KEY \`FK_month_user\``,
    );
    await queryRunner.query(`ALTER TABLE \`month\` DROP COLUMN \`userId\``);

    await queryRunner.query(
      `ALTER TABLE \`income\` DROP FOREIGN KEY \`FK_income_user\``,
    );
    await queryRunner.query(`ALTER TABLE \`income\` DROP COLUMN \`userId\``);

    await queryRunner.query(
      `ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_expense_user\``,
    );
    await queryRunner.query(`ALTER TABLE \`expense\` DROP COLUMN \`userId\``);
  }
}
