import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transactions1766018425539 implements MigrationInterface {
  name = 'Transactions1766018425539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`credit_card\` (\`id\` int NOT NULL AUTO_INCREMENT, \`lastDigits\` varchar(255) NOT NULL, \`bank\` varchar(255) NOT NULL, \`franchise\` varchar(255) NOT NULL, \`limit\` int NOT NULL, \`closingDay\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`transaction_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`maxAmount\` int NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`transaction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`datetime\` datetime NOT NULL, \`bank\` varchar(255) NOT NULL, \`merchant\` varchar(255) NOT NULL, \`amount\` int NOT NULL, \`type\` varchar(255) NOT NULL, \`cardLastDigits\` varchar(255) NOT NULL, \`approved\` tinyint NOT NULL DEFAULT 0, \`idempotencyKey\` varchar(255) NOT NULL, \`creditCardId\` int NULL, \`categoryId\` int NULL, UNIQUE INDEX \`IDX_671dd380a0e78b324bc822bfdd\` (\`idempotencyKey\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_f4f31882e04888cb0c9c272a4bf\` FOREIGN KEY (\`creditCardId\`) REFERENCES \`credit_card\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_d3951864751c5812e70d033978d\` FOREIGN KEY (\`categoryId\`) REFERENCES \`transaction_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await this.seedInitialCategories(queryRunner);
    await this.seedInitialCreditCards(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_f4f31882e04888cb0c9c272a4bf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_d3951864751c5812e70d033978d\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_671dd380a0e78b324bc822bfdd\` ON \`transaction\``,
    );
    await queryRunner.query(`DROP TABLE \`transaction\``);
    await queryRunner.query(`DROP TABLE \`credit_card\``);
    await queryRunner.query(`DROP TABLE \`transaction_category\``);
  }

  private async seedInitialCategories(queryRunner: QueryRunner) {
    const categories = [
      {
        name: 'Gas/Parq',
        description: 'Combustible y parqueaderos',
        maxAmount: 400000,
      },
      {
        name: 'Mercado',
        description: 'Compras en el mercado',
        maxAmount: 1000000,
      },
      {
        name: 'Entretenimiento',
        description: 'Cine, conciertos y más',
        maxAmount: 200000,
      },
      {
        name: 'Servicios',
        description: 'Electricidad, agua, internet, etc.',
        maxAmount: 0,
      },
      {
        name: 'Compras',
        description: 'Ropa, electrónicos y otros productos',
        maxAmount: 250000,
      },
      {
        name: 'Comida',
        description: 'Restaurantes, comida rápida y domicilios',
        maxAmount: 200000,
      },
      {
        name: 'Vacaciones',
        description: 'Gastos de viaje y hospedaje',
        maxAmount: 0,
      },
      {
        name: 'Salud',
        description: 'Gastos médicos y de farmacia',
        maxAmount: 0,
      },
      {
        name: 'Educación',
        description: 'Libros, cursos y matrículas',
        maxAmount: 0,
      },
      { name: 'Seguros', description: 'Pagos de seguros varios', maxAmount: 0 },
      {
        name: 'Donaciones',
        description: 'Aportes a organizaciones benéficas',
        maxAmount: 0,
      },
      {
        name: 'Suscripciones',
        description: 'Servicios de suscripción mensual',
        maxAmount: 100000,
      },
      {
        name: 'Impuestos',
        description: 'Pagos de impuestos y tasas',
        maxAmount: 0,
      },
      {
        name: 'Otros',
        description: 'Categoría para gastos misceláneos',
        maxAmount: 0,
      },
    ];

    for (const category of categories) {
      await queryRunner.query(
        `INSERT INTO transaction_category (name, description, maxAmount) VALUES (?, ?, ?)`,
        [category.name, category.description, category.maxAmount],
      );
    }
  }

  private async seedInitialCreditCards(queryRunner: QueryRunner) {
    const creditCards = [
      {
        lastDigits: '3775',
        bank: 'Banco de Occidente',
        franchise: 'VISA',
        limit: 150000,
        closingDay: 15,
        name: 'VISA BdO',
      },
      {
        lastDigits: '0578',
        bank: 'Banco de Occidente',
        franchise: 'MasterCard',
        limit: 250000,
        closingDay: 15,
        name: 'MASTER BdO',
      },
      {
        lastDigits: '2409',
        bank: 'Bancolombia',
        franchise: 'VISA',
        limit: 250000,
        closingDay: 15,
        name: 'VISA Bancolombia',
      },
      {
        lastDigits: '3251',
        bank: 'Bancolombia',
        franchise: 'Maestro',
        limit: 0,
        closingDay: 30,
        name: 'Ahorros Bancolombia',
      },
    ];

    for (const card of creditCards) {
      await queryRunner.query(
        `INSERT INTO credit_card (lastDigits, bank, franchise, \`limit\`, closingDay, name) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          card.lastDigits,
          card.bank,
          card.franchise,
          card.limit,
          card.closingDay,
          card.name,
        ],
      );
    }
  }
}
