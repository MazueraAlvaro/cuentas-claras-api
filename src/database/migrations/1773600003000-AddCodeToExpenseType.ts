import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCodeToExpenseType1773600003000 implements MigrationInterface {
  name = 'AddCodeToExpenseType1773600003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`expense_type\` ADD \`code\` varchar(20) NULL`,
    );

    const codes: Record<string, string> = {
      Hogar: 'HOGAR',
      Financiero: 'FIN',
      Tributario: 'TRIB',
      Seguros: 'SEG',
      'Serv. Publicos': 'SERV_PUB',
      'Prest. Sociales': 'PREST_SOC',
      Inversiones: 'INV',
      Ahorro: 'AHO',
      Ayudas: 'AYU',
      Otros: 'OTROS',
    };

    for (const [name, code] of Object.entries(codes)) {
      await queryRunner.query(
        `UPDATE \`expense_type\` SET \`code\` = ? WHERE \`name\` = ?`,
        [code, name],
      );
    }

    await queryRunner.query(
      `ALTER TABLE \`expense_type\` MODIFY \`code\` varchar(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense_type\` ADD UNIQUE INDEX \`IDX_expense_type_code\` (\`code\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`expense_type\` DROP INDEX \`IDX_expense_type_code\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`expense_type\` DROP COLUMN \`code\``,
    );
  }
}
