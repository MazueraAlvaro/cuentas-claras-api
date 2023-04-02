import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseType } from './database/entities/expense-type.entity';
import { Expense } from './database/entities/expense.entity';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'database',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'cuentas_claras',
      entities: [ExpenseType, Expense],
      autoLoadEntities: true,
      synchronize: false,
    }),
    ExpensesModule,
  ],
})
export class AppModule {}
