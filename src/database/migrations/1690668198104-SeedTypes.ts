import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTypes1690668198104 implements MigrationInterface {
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

    await queryRunner.query(
      `INSERT INTO income (name, description, amount, isRecurring, startAt, incomeTypeId) VALUES 
      ('Salario', 'Salario de EPAM', 8000000, true, '2022-05-31', 1)`,
    );

    await queryRunner.query(
      `INSERT INTO expense (name, description, amount, isRecurring, dueDay, startAt, expenseTypeId) VALUES 
      ('Arriendo', 'Arriendo apartamento', 1800000, true, 1,'2022-10-01', 1)`,
    );
  }

  public async down(): Promise<void> {
    return;
  }
}
