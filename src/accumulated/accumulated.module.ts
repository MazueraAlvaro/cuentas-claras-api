import { Module } from '@nestjs/common';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { IncomesModule } from 'src/incomes/incomes.module';
import { AccumulatedService } from './accumulates.service';
import { AccumulatedController } from './accumulates.controller';

@Module({
  imports: [ExpensesModule, IncomesModule],
  controllers: [AccumulatedController],
  providers: [AccumulatedService],
  exports: [AccumulatedService],
})
export class AccumulatedModule {}
