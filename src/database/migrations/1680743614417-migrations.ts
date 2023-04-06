import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1680743614417 implements MigrationInterface {
  name = 'migrations1680743614417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`income_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`income\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`amount\` int NOT NULL, \`isRecurring\` tinyint NOT NULL, \`startAt\` date NULL, \`endAt\` date NULL, \`incomeTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`month_income\` (\`id\` int NOT NULL AUTO_INCREMENT, \`monthId\` int NOT NULL, \`incomeId\` int NOT NULL, \`amount\` int NOT NULL, \`received\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`month\` (\`id\` int NOT NULL AUTO_INCREMENT, \`month\` date NOT NULL, \`status\` enum ('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN', \`totalIncomes\` int NOT NULL DEFAULT '0', \`totalExpenses\` int NOT NULL DEFAULT '0', \`difference\` int NOT NULL DEFAULT '0', \`currentBalance\` int NOT NULL DEFAULT '0', \`totalUnpaid\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`month_expense\` (\`id\` int NOT NULL AUTO_INCREMENT, \`monthId\` int NOT NULL, \`expenseId\` int NOT NULL, \`amount\` int NOT NULL, \`paid\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`expense\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`amount\` int NOT NULL, \`isRecurring\` tinyint NOT NULL, \`dueDay\` int NOT NULL, \`startAt\` date NULL, \`endAt\` date NULL, \`expenseTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`expense_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` ADD CONSTRAINT \`FK_162af2f33f209161e7d5310458e\` FOREIGN KEY (\`incomeTypeId\`) REFERENCES \`income_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`month_income\` ADD CONSTRAINT \`FK_4c8534555b5c2cbec14677fa9fa\` FOREIGN KEY (\`monthId\`) REFERENCES \`month\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`month_income\` ADD CONSTRAINT \`FK_ae0bf0fc02a08706a1410c74121\` FOREIGN KEY (\`incomeId\`) REFERENCES \`income\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`month_expense\` ADD CONSTRAINT \`FK_d601fb4b7af9cee692c8d0bf5b5\` FOREIGN KEY (\`monthId\`) REFERENCES \`month\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`month_expense\` ADD CONSTRAINT \`FK_e7077daf3b8887d8cf0f37af2a7\` FOREIGN KEY (\`expenseId\`) REFERENCES \`expense\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_6409b02bdfe2376ca457cb799e6\` FOREIGN KEY (\`expenseTypeId\`) REFERENCES \`expense_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_6409b02bdfe2376ca457cb799e6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`month_expense\` DROP FOREIGN KEY \`FK_e7077daf3b8887d8cf0f37af2a7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`month_expense\` DROP FOREIGN KEY \`FK_d601fb4b7af9cee692c8d0bf5b5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`month_income\` DROP FOREIGN KEY \`FK_ae0bf0fc02a08706a1410c74121\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`month_income\` DROP FOREIGN KEY \`FK_4c8534555b5c2cbec14677fa9fa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` DROP FOREIGN KEY \`FK_162af2f33f209161e7d5310458e\``,
    );
    await queryRunner.query(`DROP TABLE \`expense_type\``);
    await queryRunner.query(`DROP TABLE \`expense\``);
    await queryRunner.query(`DROP TABLE \`month_expense\``);
    await queryRunner.query(`DROP TABLE \`month\``);
    await queryRunner.query(`DROP TABLE \`month_income\``);
    await queryRunner.query(`DROP TABLE \`income\``);
    await queryRunner.query(`DROP TABLE \`income_type\``);
  }
}
