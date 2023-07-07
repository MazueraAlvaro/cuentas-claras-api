import { Injectable } from '@nestjs/common';
import { ExpensesService } from 'src/expenses/expenses.service';
import {
  ExpenseAccumulated,
  MonthAccumulated,
} from './dto/expense-accumulated.dto';
import { getMonthNames } from 'src/utils/month.util';

@Injectable()
export class AccumulatedService {
  constructor(private readonly expensesService: ExpensesService) {}
  async getExpensesAccumulated(from: string, to: string) {
    const history = await this.expensesService.getExpensesHistory(
      from.slice(0, 8) + '00',
      to.slice(0, 8) + '00',
    );
    const data: ExpenseAccumulated[] = history.map((expense) => {
      const { monthExpenses, ...expenseData } = expense;
      let totalPaid = 0;
      let totalUnpaid = 0;
      const months: MonthAccumulated[] = monthExpenses.map((monthExpense) => {
        totalPaid += monthExpense.paid ? monthExpense.amount : 0;
        totalUnpaid += !monthExpense.paid ? monthExpense.amount : 0;
        const month = new Date(monthExpense.month.month.toString());
        month.setDate(month.getDate() + 2);
        return {
          amount: monthExpense.amount,
          paid: monthExpense.paid,
          month: month.getMonth(),
        };
      });

      return {
        expense: expenseData,
        months,
        totalPaid,
        totalUnpaid,
        total: totalPaid + totalUnpaid,
      };
    });
    const fromDate = new Date(from.slice(0, 8) + '02');
    const toDate = new Date(to.slice(0, 8) + '03');
    return {
      data,
      months: getMonthNames(fromDate, toDate),
    };
  }
}
