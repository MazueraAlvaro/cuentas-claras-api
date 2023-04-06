import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonthExpense } from 'src/database/entities/month-expense.entity';
import { MonthIncome } from 'src/database/entities/month-income.entity';
import { Month } from 'src/database/entities/month.entity';
import { MonthStatus } from 'src/enums/month-status.enum';
import { ExpensesService } from 'src/expenses/expenses.service';
import { IncomesService } from 'src/incomes/incomes.service';
import { Repository } from 'typeorm';

@Injectable()
export class MonthsService {
  constructor(
    @InjectRepository(Month)
    private readonly monthRepository: Repository<Month>,
    private readonly incomesService: IncomesService,
    private readonly expensesService: ExpensesService,
  ) {}
  async generateMonth(month: Date) {
    const exists = await this.monthRepository.findOne({ where: { month } });
    if (exists) {
      throw new ForbiddenException({
        error: true,
        message: 'Month already exists',
      });
    }
    const { monthIncomes, totalIncomes } = await this.getMonthRecurringIncomes(
      month,
    );
    const { monthExpenses, totalExpenses } =
      await this.getMonthRecurringExpenses(month);
    const monthEntity = new Month();
    monthEntity.month = month;
    monthEntity.status = MonthStatus.OPEN;
    monthEntity.monthIncomes = monthIncomes;
    monthEntity.monthExpenses = monthExpenses;
    monthEntity.totalExpenses = totalExpenses;
    monthEntity.totalIncomes = totalIncomes;
    monthEntity.difference = totalIncomes - totalExpenses;
    monthEntity.currentBalance = totalIncomes;
    monthEntity.totalUnpaid = totalExpenses;
    return this.monthRepository.save(monthEntity);
  }

  private async getMonthRecurringIncomes(month: Date) {
    const incomes = await this.incomesService.getIncomesByMonth(month);
    let totalIncomes = 0;
    const monthIncomes = incomes.map((income) => {
      totalIncomes += income.amount;
      const monthIncome = new MonthIncome();
      monthIncome.income = income;
      monthIncome.amount = income.amount;
      monthIncome.received = false;
      return monthIncome;
    });
    return { monthIncomes, totalIncomes };
  }
  private async getMonthRecurringExpenses(month: Date) {
    const expenses = await this.expensesService.getExpensesByMonth(month);
    let totalExpenses = 0;
    const monthExpenses = expenses.map((expense) => {
      totalExpenses += expense.amount;
      const monthExpense = new MonthExpense();
      monthExpense.expense = expense;
      monthExpense.amount = expense.amount;
      monthExpense.paid = false;
      return monthExpense;
    });
    return { monthExpenses, totalExpenses };
  }
}
