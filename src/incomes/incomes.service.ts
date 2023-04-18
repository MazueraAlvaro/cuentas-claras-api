import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from 'src/database/entities/income.entity';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UpdateIncomeDTO } from './dto/income-update.dto';
import { CreateIncomeDTO } from './dto/income.dto';
import { IncomeType } from 'src/database/entities/income-type.entity';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Income)
    private readonly incomesRepository: Repository<Income>,
    @InjectRepository(IncomeType)
    private readonly incomeTypeRepository: Repository<IncomeType>,
  ) {}

  findAll(): Promise<Income[]> {
    return this.incomesRepository.find();
  }

  findOne(id: number): Promise<Income | null> {
    return this.incomesRepository.findOneByOrFail({ id });
  }

  async create(createIncomeDTO: CreateIncomeDTO) {
    const income = await this.incomesRepository.save(createIncomeDTO);
    return this.findOne(income.id);
  }

  async update(id: number, updateIncomeDTO: UpdateIncomeDTO) {
    const expense = await this.findOne(id);
    return this.incomesRepository.save({ ...expense, ...updateIncomeDTO });
  }

  getIncomesByMonth(month: Date) {
    return this.incomesRepository.find({
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

  findAllTypes() {
    return this.incomeTypeRepository.find();
  }

  delete(id: number) {
    return this.incomesRepository.delete(id);
  }
}
