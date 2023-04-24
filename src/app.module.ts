import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesModule } from './incomes/incomes.module';
import { MonthsModule } from './months/months.module';
import { ConfigModule } from '@nestjs/config';
console.log(join(__dirname, 'database', 'entities', '*.entity.ts'));
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [join(__dirname, 'database', 'entities', '*.entity.{js,ts}')],
      migrations: [join(__dirname, 'database', 'migrations', '*.{js,ts}')],
      autoLoadEntities: true,
      migrationsRun: true,
      synchronize: false,
      logging: true,
    }),
    ExpensesModule,
    IncomesModule,
    MonthsModule,
  ],
})
export class AppModule {}
