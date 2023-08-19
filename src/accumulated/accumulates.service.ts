import { Injectable } from '@nestjs/common';
import { ExpensesService } from 'src/expenses/expenses.service';
import {
  ExpenseAccumulated,
  MonthAccumulated,
} from './dto/expense-accumulated.dto';
import { getMonthNameByDate, getMonthNames } from 'src/utils/month.util';

@Injectable()
export class AccumulatedService {
  constructor(private readonly expensesService: ExpensesService) {}
  async getExpensesAccumulated(
    from: string,
    to: string,
    expenseId: number | null = null,
  ) {
    const history = await this.expensesService.getExpensesHistory(
      from.slice(0, 8) + '00',
      to.slice(0, 8) + '00',
      expenseId,
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
          monthName: getMonthNameByDate(month),
          year: month.getFullYear(),
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

  async getExpenseAccumulated(
    fromDate: string,
    toDate: string,
    expenseId: number,
  ) {
    const data = await this.getExpensesAccumulated(fromDate, toDate, expenseId);
    const chartData = data.data.flatMap((history) => {
      return history.months.map((month) => {
        return { amount: month.amount, month: month.monthName };
      });
    });
    return { data, chartData };
  }
}
