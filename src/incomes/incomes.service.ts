import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from 'src/database/entities/income.entity';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UpdateIncomeDTO } from './dto/income-update.dto';
import { CreateIncomeDTO } from './dto/income.dto';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Income)
    private readonly incomesRepository: Repository<Income>,
  ) {}

  findAll(): Promise<Income[]> {
    return this.incomesRepository.find();
  }

  findOne(id: number): Promise<Income | null> {
    return this.incomesRepository.findOneByOrFail({ id });
  }

  create(createIncomeDTO: CreateIncomeDTO) {
    return this.incomesRepository.save(createIncomeDTO);
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
}
