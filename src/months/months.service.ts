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

  findById(id: number, userId: number) {
    return this.monthRepository.findOne({
      where: { id, userId },
      relations: ['monthExpenses.expense', 'monthIncomes.income'],
    });
  }

  findByDate(date: Date, userId: number) {
    return this.monthRepository.findOneOrFail({
      where: { month: date, userId },
      relations: ['monthExpenses.expense', 'monthIncomes.income'],
    });
  }

  async generateMonth(month: Date, userId: number) {
    const exists = await this.monthRepository.findOne({
      where: { month, userId },
    });
    if (exists) {
      throw new ForbiddenException({
        error: true,
        message: 'Month already exists',
      });
    }
    const monthIncomes = await this.getMonthRecurringIncomes(month, userId);
    const monthExpenses = await this.getMonthRecurringExpenses(month, userId);
    const monthEntity = new Month();
    monthEntity.month = month;
    monthEntity.userId = userId;
    monthEntity.status = MonthStatus.OPEN;
    monthEntity.monthIncomes = monthIncomes;
    monthEntity.monthExpenses = monthExpenses;
    this.calculateAndUpdateTotals(monthEntity);
    return this.monthRepository.save(monthEntity);
  }

  private async getMonthRecurringIncomes(month: Date, userId: number) {
    const incomes = await this.incomesService.getIncomesByMonth(month, userId);
    return incomes.map((income) => {
      const monthIncome = new MonthIncome();
      monthIncome.income = income;
      monthIncome.amount = income.amount;
      monthIncome.received = false;
      return monthIncome;
    });
  }

  private async getMonthRecurringExpenses(month: Date, userId: number) {
    const expenses = await this.expensesService.getExpensesByMonth(
      month,
      userId,
    );
    return expenses.map((expense) => {
      const monthExpense = new MonthExpense();
      monthExpense.expense = expense;
      monthExpense.amount = expense.amount;
      monthExpense.paid = false;
      monthExpense.creditCard = false;
      return monthExpense;
    });
  }

  async addExpenseById(monthId: number, expenseId: number, userId: number) {
    const exists = await this.monthRepository.count({
      where: { monthExpenses: { expenseId }, id: monthId, userId },
    });
    if (exists > 0) {
      throw new ForbiddenException({
        error: true,
        message: 'The expense already exists for the month',
      });
    }
    const month = await this.findById(monthId, userId);
    if (!month) {
      throw new NotFoundException({ error: true, message: 'Month not found' });
    }
    let expense;
    try {
      expense = await this.expensesService.findOne(expenseId, userId);
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
    newMonthExpense.creditCard = false;
    month.monthExpenses.push(newMonthExpense);
    this.calculateAndUpdateTotals(month);
    return this.monthRepository.save(month);
  }

  async addIncomeById(monthId: number, incomeId: number, userId: number) {
    const exists = await this.monthRepository.count({
      where: { monthIncomes: { incomeId }, id: monthId, userId },
    });
    if (exists > 0) {
      throw new ForbiddenException({
        error: true,
        message: 'The income already exists for the month',
      });
    }
    const month = await this.findById(monthId, userId);
    if (!month) {
      throw new NotFoundException({ error: true, message: 'Month not found' });
    }
    let income;
    try {
      income = await this.incomesService.findOne(incomeId, userId);
    } catch (e) {
      throw new NotFoundException({ error: true, message: 'Income not found' });
    }
    const newMonthIncome = new MonthIncome();
    newMonthIncome.income = income;
    newMonthIncome.amount = income.amount;
    newMonthIncome.received = false;
    month.monthIncomes.push(newMonthIncome);
    this.calculateAndUpdateTotals(month);
    return this.monthRepository.save(month);
  }

  async updateExpenseByMonthExpenseId(
    monthId: number,
    monthExpenseId: number,
    updateMonthExpenseDTO: UpdateMonthExpenseDTO,
    userId: number,
  ) {
    const exists = await this.monthRepository.count({
      where: { monthExpenses: { id: monthExpenseId }, id: monthId, userId },
    });
    if (exists == 0) {
      throw new NotFoundException({
        error: true,
        message: 'Month expense not found',
      });
    }
    const month = await this.findById(monthId, userId);
    const monthExpense = month.monthExpenses.find(
      (me) => me.id === monthExpenseId,
    );
    Object.assign(monthExpense, updateMonthExpenseDTO);
    this.calculateAndUpdateTotals(month);
    return this.monthRepository.save(month);
  }

  async updateIncomeByMonthIncomeId(
    monthId: number,
    monthIncomeId: number,
    updateMonthIncomeDTO: UpdateMonthIncomeDTO,
    userId: number,
  ) {
    const exists = await this.monthRepository.count({
      where: { monthIncomes: { id: monthIncomeId }, id: monthId, userId },
    });
    if (exists == 0) {
      throw new NotFoundException({
        error: true,
        message: 'Month income not found',
      });
    }
    const month = await this.findById(monthId, userId);
    const monthIncome = month.monthIncomes.find(
      (mi) => mi.id === monthIncomeId,
    );
    Object.assign(monthIncome, updateMonthIncomeDTO);
    this.calculateAndUpdateTotals(month);
    return this.monthRepository.save(month);
  }

  async deleteMonthExpenseById(
    monthId: number,
    monthExpenseId: number,
    userId: number,
  ) {
    const exists = await this.monthRepository.count({
      where: { monthExpenses: { id: monthExpenseId }, id: monthId, userId },
    });
    if (exists <= 0) {
      throw new ForbiddenException({
        error: true,
        message: 'The expense does not exist for the month',
      });
    }
    const month = await this.findById(monthId, userId);
    if (!month) {
      throw new NotFoundException({ error: true, message: 'Month not found' });
    }
    month.monthExpenses = month.monthExpenses.filter(
      (me) => me.id !== monthExpenseId,
    );
    this.calculateAndUpdateTotals(month);
    return this.monthRepository.save(month);
  }

  async deleteMonthIncomeById(
    monthId: number,
    monthIncomeId: number,
    userId: number,
  ) {
    const exists = await this.monthRepository.count({
      where: { monthIncomes: { id: monthIncomeId }, id: monthId, userId },
    });
    if (exists <= 0) {
      throw new ForbiddenException({
        error: true,
        message: 'The income does not exist for the month',
      });
    }
    const month = await this.findById(monthId, userId);
    if (!month) {
      throw new NotFoundException({ error: true, message: 'Month not found' });
    }
    month.monthIncomes = month.monthIncomes.filter(
      (mi) => mi.id !== monthIncomeId,
    );
    this.calculateAndUpdateTotals(month);
    return this.monthRepository.save(month);
  }

  private calculateAndUpdateTotals(month: Month) {
    const totals = {
      totalExpenses: 0,
      totalExpensesCreditCard: 0,
      totalIncomes: 0,
      totalUnpaid: 0,
      totalUnpaidCreditCard: 0,
    };
    month.monthExpenses.reduce((totals, monthExpense) => {
      totals.totalExpenses += monthExpense.amount;
      totals.totalExpensesCreditCard += monthExpense.creditCard
        ? monthExpense.amount
        : 0;
      totals.totalUnpaid += monthExpense.paid ? 0 : monthExpense.amount;
      totals.totalUnpaidCreditCard +=
        !monthExpense.paid && monthExpense.creditCard ? monthExpense.amount : 0;
      return totals;
    }, totals);
    month.monthIncomes.reduce((totals, monthIncome) => {
      totals.totalIncomes += monthIncome.received ? monthIncome.amount : 0;
      return totals;
    }, totals);

    month.totalExpenses = totals.totalExpenses;
    month.totalIncomes = totals.totalIncomes;
    month.totalUnpaid = totals.totalUnpaid;
    month.difference =
      totals.totalIncomes -
      totals.totalExpenses +
      totals.totalExpensesCreditCard;
    const currentBalance =
      totals.totalIncomes -
      totals.totalExpenses +
      totals.totalUnpaid +
      totals.totalExpensesCreditCard -
      totals.totalUnpaidCreditCard;
    month.currentBalance = currentBalance < 0 ? 0 : currentBalance;
  }

  async closeMonthById(id: number, userId: number) {
    const month = await this.findById(id, userId);
    month.status = MonthStatus.CLOSE;
    return this.monthRepository.save(month);
  }
}
