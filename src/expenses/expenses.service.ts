import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from 'src/database/entities/expense.entity';
import { Repository } from 'typeorm';

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
}
