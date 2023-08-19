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

  findAll(): Promise<Expense[]> {
    return this.expensesRepository.find();
  }

  findOne(id: number): Promise<Expense | null> {
    return this.expensesRepository.findOneByOrFail({ id });
  }

  async create(createExpenseDTO: CreateExpenseDTO) {
    const expense = await this.expensesRepository.save(createExpenseDTO);
    return this.findOne(expense.id);
  }

  async update(id: number, updateExpenseDTO: UpdateExpenseDTO) {
    const expense = await this.findOne(id);
    return this.expensesRepository.save({ ...expense, ...updateExpenseDTO });
  }

  getExpensesByMonth(month: Date) {
    return this.expensesRepository.find({
      where: [
        {
          isRecurring: true,
          startAt: LessThanOrEqual(month),
          endAt: MoreThanOrEqual(month),
        },
        {
          isRecurring: true,
          startAt: LessThanOrEqual(month),
          endAt: IsNull(),
        },
      ],
    });
  }

  getExpensesHistory(
    from: string,
    to: string,
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

  delete(id: number) {
    return this.expensesRepository.delete(id);
  }
}
