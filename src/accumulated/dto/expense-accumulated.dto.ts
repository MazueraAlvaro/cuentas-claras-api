import { Expense } from 'src/database/entities/expense.entity';

export interface MonthAccumulated {
  amount: number;
  month: number;
  paid: boolean;
  monthName: string;
  year: number;
}

export interface ExpenseAccumulated {
  expense: Partial<Expense>;
  months: MonthAccumulated[];
  totalPaid: number;
  totalUnpaid: number;
  total: number;
}
