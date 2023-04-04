import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from 'src/database/entities/expense.entity';
import { Repository } from 'typeorm';
import { CreateExpenseDTO } from './dto/expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expensesRepository: Repository<Expense>,
  ) {}

  findAll(): Promise<Expense[]> {
    return this.expensesRepository.find();
  }

  findOne(id: number): Promise<Expense | null> {
    return this.expensesRepository.findOneBy({ id });
  }

  create(createExpenseDTO: CreateExpenseDTO) {
    return this.expensesRepository.save(createExpenseDTO);
  }
}
