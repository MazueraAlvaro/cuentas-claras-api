import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from 'src/database/entities/expense.entity';
import {
  Between,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UpdateExpenseDTO } from './dto/expense-update.dto';
import { CreateExpenseDTO } from './dto/expense.dto';
import { ExpenseType } from 'src/database/entities/expense-type.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expensesRepository: Repository<Expense>,
    @InjectRepository(ExpenseType)
    private readonly expenseTypeRepository: Repository<ExpenseType>,
  ) {}

  findAll(userId: number): Promise<Expense[]> {
    return this.expensesRepository.find({ where: { userId } });
  }

  findOne(id: number, userId: number): Promise<Expense | null> {
    return this.expensesRepository.findOneByOrFail({ id, userId });
  }

  async create(createExpenseDTO: CreateExpenseDTO, userId: number) {
    const expense = await this.expensesRepository.save({
      ...createExpenseDTO,
      userId,
    });
    return this.findOne(expense.id, userId);
  }

  async update(id: number, updateExpenseDTO: UpdateExpenseDTO, userId: number) {
    const expense = await this.findOne(id, userId);
    return this.expensesRepository.save({ ...expense, ...updateExpenseDTO });
  }

  getExpensesByMonth(month: Date, userId: number) {
    return this.expensesRepository.find({
      where: [
        {
          isRecurring: true,
          startAt: LessThanOrEqual(month),
          endAt: MoreThanOrEqual(month),
          userId,
        },
        {
          isRecurring: true,
          startAt: LessThanOrEqual(month),
          endAt: IsNull(),
          userId,
        },
      ],
    });
  }

  getExpensesHistory(
    from: string,
    to: string,
    userId: number,
    expenseId: number | null = null,
  ) {
    return this.expensesRepository.find({
      where: [
        {
          monthExpenses: {
            month: {
              month: Between(from as unknown as Date, to as unknown as Date),
            },
          },
          userId,
          ...(expenseId && { id: expenseId }),
        },
      ],
      relations: ['monthExpenses.month'],
      loadEagerRelations: false,
    });
  }

  findAllTypes() {
    return this.expenseTypeRepository.find();
  }

  delete(id: number, userId: number) {
    return this.expensesRepository.delete({ id, userId });
  }
}
