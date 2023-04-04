import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1680569307959 implements MigrationInterface {
  name = 'migrations1680569307959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`expense_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`expense\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`amount\` int NOT NULL, \`isRecurring\` tinyint NOT NULL, \`dueDay\` int NOT NULL, \`startAt\` date NULL, \`endAt\` date NULL, \`expenseTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_6409b02bdfe2376ca457cb799e6\` FOREIGN KEY (\`expenseTypeId\`) REFERENCES \`expense_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_6409b02bdfe2376ca457cb799e6\``,
    );
    await queryRunner.query(`DROP TABLE \`expense\``);
    await queryRunner.query(`DROP TABLE \`expense_type\``);
  }
}
