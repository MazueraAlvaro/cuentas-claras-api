import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTypes1680668198104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO expense_type (name, description) VALUES 
      ('Hogar', 'Gastos del hogar'),
      ('Financiero', 'Gastos financieros como creditos bancarios'); `,
    );

    await queryRunner.query(
      `INSERT INTO income_type (name, description) VALUES 
      ('Salario', 'Ingreso debido a salario mensual'),
      ('Saldo', 'Ingreso por saldo de dinero del anterior mes'),
      ('Otro', 'Otros Ingresos');`,
    );
  }

  public async down(): Promise<void> {
    return;
  }
}
