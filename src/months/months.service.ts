import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonthExpense } from 'src/database/entities/month-expense.entity';
import { MonthIncome } from 'src/database/entities/month-income.entity';
import { Month } from 'src/database/entities/month.entity';
import { MonthStatus } from 'src/enums/month-status.enum';
import { ExpensesService } from 'src/expenses/expenses.service';
import { IncomesService } from 'src/incomes/incomes.service';
import { Repository } from 'typeorm';
import { UpdateMonthExpenseDTO } from './dto/month-expense-update.dto';
import { UpdateMonthIncomeDTO } from './dto/month-income-update.dto';

@Injectable()
export class MonthsService {
  constructor(
    @InjectRepository(Month)
    private readonly monthRepository: Repository<Month>,
    private readonly incomesService: IncomesService,
    private readonly expensesService: ExpensesService,
  ) {}

  findById(id) {
    return this.monthRepository.findOne({
      where: { id },
      relations: ['monthExpenses.expense', 'monthIncomes.income'],
    });
  }

  findByDate(date: Date) {
    return this.monthRepository.findOne({
      where: { month: date },
      relations: ['monthExpenses.expense', 'monthIncomes.income'],
    });
  }

  async generateMonth(month: Date) {
    const exists = await this.monthRepository.findOne({ where: { month } });
    if (exists) {
      throw new ForbiddenException({
        error: true,
        message: 'Month already exists',
      });
    }
    const monthIncomes = await this.getMonthRecurringIncomes(month);
    const monthExpenses = await this.getMonthRecurringExpenses(month);
    const monthEntity = new Month();
    monthEntity.month = month;
    monthEntity.status = MonthStatus.OPEN;
    monthEntity.monthIncomes = monthIncomes;
    monthEntity.monthExpenses = monthExpenses;
    this.calculateAndUpdateTotals(monthEntity);
    return this.monthRepository.save(monthEntity);
  }

  private async getMonthRecurringIncomes(month: Date) {
    const incomes = await this.incomesService.getIncomesByMonth(month);
    const monthIncomes = incomes.map((income) => {
      const monthIncome = new MonthIncome();
      monthIncome.income = income;
      monthIncome.amount = income.amount;
      monthIncome.received = false;
      return monthIncome;
    });
    return monthIncomes;
  }

  private async getMonthRecurringExpenses(month: Date) {
    const expenses = await this.expensesService.getExpensesByMonth(month);
    const monthExpenses = expenses.map((expense) => {
      const monthExpense = new MonthExpense();
      monthExpense.expense = expense;
      monthExpense.amount = expense.amount;
      monthExpense.paid = false;
      return monthExpense;
    });
    return monthExpenses;
  }

  async addExpenseById(monthId: number, expenseId: number) {
    const exists = await this.monthRepository.count({
      where: { monthExpenses: { expenseId }, id: monthId },
    });
    if (exists > 0) {
      throw new ForbiddenException({
        error: true,
        message: 'The expense already exists for the month',
      });
    }
    const month = await this.monthRepository.findOneBy({ id: monthId });
    if (!month) {
      throw new NotFoundException({
        error: true,
        message: 'Month not found',
      });
    }
    let expense;
    try {
      expense = await this.expensesService.findOne(expenseId);
    } catch (e) {
      throw new NotFoundException({
        error: true,
        message: 'Expense not found',
      });
    }
    const newMonthExpense = new MonthExpense();
    newMonthExpense.expense = expense;
    newMonthExpense.amount = expense.amount;
    newMonthExpense.paid = false;
    month.monthExpenses.push(newMonthExpense);
    return this.monthRepository.save(month);
  }

  async addIncomeById(monthId: number, incomeId: number) {
    const exists = await this.monthRepository.count({
      where: { monthIncomes: { incomeId }, id: monthId },
    });
    if (exists > 0) {
      throw new ForbiddenException({
        error: true,
        message: 'The income already exists for the month',
      });
    }
    const month = await this.monthRepository.findOneBy({ id: monthId });
    if (!month) {
      throw new NotFoundException({
        error: true,
        message: 'Month not found',
      });
    }
    let income;
    try {
      income = await this.incomesService.findOne(incomeId);
    } catch (e) {
      throw new NotFoundException({
        error: true,
        message: 'Income not found',
      });
    }
    const newMonthIncome = new MonthIncome();
    newMonthIncome.income = income;
    newMonthIncome.amount = income.amount;
    newMonthIncome.received = false;
    month.monthIncomes.push(newMonthIncome);
    return this.monthRepository.save(month);
  }

  async updateExpenseByMonthExpenseId(
    monthId: number,
    monthExpenseId: number,
    updateMonthExpenseDTO: UpdateMonthExpenseDTO,
  ) {
    const exists = await this.monthRepository.count({
      where: { monthExpenses: { id: monthExpenseId }, id: monthId },
    });
    if (exists == 0) {
      throw new NotFoundException({
        error: true,
        message: 'Month expense not found',
      });
    }
    const month = await this.findById(monthId);
    const monthExpense = month.monthExpenses.find(
      (monthExpense) => monthExpense.id === monthExpenseId,
    );
    Object.assign(monthExpense, updateMonthExpenseDTO);
    this.calculateAndUpdateTotals(month);
    return this.monthRepository.save(month);
  }

  async updateIncomeByMonthIncomeId(
    monthId: number,
    monthIncomeId: number,
    updateMonthIncomeDTO: UpdateMonthIncomeDTO,
  ) {
    const exists = await this.monthRepository.count({
      where: { monthIncomes: { id: monthIncomeId } },
    });
    if (exists == 0) {
      throw new NotFoundException({
        error: true,
        message: 'Month income not found',
      });
    }
    const month = await this.findById(monthId);
    const monthIncome = month.monthIncomes.find(
      (monthIncome) => monthIncome.id === monthIncomeId,
    );
    Object.assign(monthIncome, updateMonthIncomeDTO);
    this.calculateAndUpdateTotals(month);
    return this.monthRepository.save(month);
  }

  private calculateAndUpdateTotals(month: Month) {
    const totals = {
      totalExpenses: 0,
      totalIncomes: 0,
      totalUnpaid: 0,
    };
    month.monthExpenses.reduce((totals, monthExpense) => {
      totals.totalExpenses += monthExpense.amount;
      totals.totalUnpaid += monthExpense.paid ? 0 : monthExpense.amount;
      return totals;
    }, totals);
    month.monthIncomes.reduce((totals, monthIncome) => {
      totals.totalIncomes += monthIncome.received ? monthIncome.amount : 0;
      return totals;
    }, totals);

    month.totalExpenses = totals.totalExpenses;
    month.totalIncomes = totals.totalIncomes;
    month.totalUnpaid = totals.totalUnpaid;
    month.difference = totals.totalIncomes - totals.totalExpenses;
    const currentBalance =
      totals.totalIncomes - totals.totalExpenses + totals.totalUnpaid;
    month.currentBalance = currentBalance < 0 ? 0 : currentBalance;
  }
}
