import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTypes1690668198104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO expense_type (name, description) VALUES 
      ('Hogar', 'Gastos del hogar'),
      ('Financiero', 'Gastos financieros como creditos bancarios'),
      ('Tributario', 'Gastos tributarios como impuestos de renta o predial'),
      ('Seguros', 'Seguros de vida o todo riesgo de vehiculos'),
      ('Serv. Publicos', 'Servicios publicos como agua, energia o gas'),
      ('Prest. Sociales', 'Pagos por motivo de prestaciones sociales como salud y pensión'),
      ('Inversiones', 'Dinero destinado a inversiones'),
      ('Ahorro', 'Dinero destinado a ahorro'),
      ('Ayudas', 'Dinero destinado a ayudas'),
      ('Otros', 'Otros gastos');`,
    );

    await queryRunner.query(
      `INSERT INTO income_type (name, description) VALUES
      ('Salario', 'Ingreso debido a salario mensual'),
      ('Saldo', 'Ingreso por saldo de dinero del anterior mes'),
      ('Bonos', 'Bonos adicionales al pago salarial'),
      ('Otro', 'Otros Ingresos');`,
    );

    // await queryRunner.query(
    //   `INSERT INTO income (name, description, amount, isRecurring, startAt, incomeTypeId) VALUES
    //   ('Salario', 'Salario de EPAM', 8000000, true, '2022-05-31', 1)`,
    // );

    // await queryRunner.query(
    //   `INSERT INTO expense (name, description, amount, isRecurring, dueDay, startAt, expenseTypeId) VALUES
    //   ('Arriendo', 'Arriendo apartamento', 1800000, true, 1,'2022-10-01', 1),
    //   ('Carro', 'Crédito de vehículo Santander', 1608694, true, 3, '2022-09-01', 2),
    //   ('ICETEX', 'Crédito euducativo ICETEX', 550000, true, 3, '2020-06-23', 2),
    //   ('GDO', 'Gases de Occidente', 15000, true, 15, '2022-10-01', 1)`,
    // );
  }

  public async down(): Promise<void> {
    return;
  }
}
