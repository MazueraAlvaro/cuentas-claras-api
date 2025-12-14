import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transactions1765587673898 implements MigrationInterface {
  name = 'Transactions1765587673898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`credit_card\` (\`id\` int NOT NULL AUTO_INCREMENT, \`lastDigits\` varchar(255) NOT NULL, \`bank\` varchar(255) NOT NULL, \`franchise\` varchar(255) NOT NULL, \`limit\` int NOT NULL, \`closingDay\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`transaction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`datetime\` datetime NOT NULL, \`bank\` varchar(255) NOT NULL, \`merchant\` varchar(255) NOT NULL, \`amount\` int NOT NULL, \`type\` varchar(255) NOT NULL, \`cardLastDigits\` varchar(255) NOT NULL, \`approved\` tinyint NOT NULL DEFAULT 0, \`creditCardId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_6409b02bdfe2376ca457cb799e6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` CHANGE \`startAt\` \`startAt\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` CHANGE \`endAt\` \`endAt\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` CHANGE \`expenseTypeId\` \`expenseTypeId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` DROP FOREIGN KEY \`FK_162af2f33f209161e7d5310458e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` CHANGE \`startAt\` \`startAt\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` CHANGE \`endAt\` \`endAt\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` CHANGE \`incomeTypeId\` \`incomeTypeId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_f4f31882e04888cb0c9c272a4bf\` FOREIGN KEY (\`creditCardId\`) REFERENCES \`credit_card\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_6409b02bdfe2376ca457cb799e6\` FOREIGN KEY (\`expenseTypeId\`) REFERENCES \`expense_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` ADD CONSTRAINT \`FK_162af2f33f209161e7d5310458e\` FOREIGN KEY (\`incomeTypeId\`) REFERENCES \`income_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`income\` DROP FOREIGN KEY \`FK_162af2f33f209161e7d5310458e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_6409b02bdfe2376ca457cb799e6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_f4f31882e04888cb0c9c272a4bf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` CHANGE \`incomeTypeId\` \`incomeTypeId\` int NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` CHANGE \`endAt\` \`endAt\` date NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` CHANGE \`startAt\` \`startAt\` date NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`income\` ADD CONSTRAINT \`FK_162af2f33f209161e7d5310458e\` FOREIGN KEY (\`incomeTypeId\`) REFERENCES \`income_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` CHANGE \`expenseTypeId\` \`expenseTypeId\` int NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` CHANGE \`endAt\` \`endAt\` date NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` CHANGE \`startAt\` \`startAt\` date NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_6409b02bdfe2376ca457cb799e6\` FOREIGN KEY (\`expenseTypeId\`) REFERENCES \`expense_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE \`transaction\``);
    await queryRunner.query(`DROP TABLE \`credit_card\``);
  }
}
