import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesModule } from './incomes/incomes.module';
import { MonthsModule } from './months/months.module';
console.log(join(__dirname, 'database', 'entities', '*.entity.ts'));
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'database',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'cuentas_claras',
      entities: [join(__dirname, 'database', 'entities', '*.entity.{js,ts}')],
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
    }),
    ExpensesModule,
    IncomesModule,
    MonthsModule,
  ],
})
export class AppModule {}
