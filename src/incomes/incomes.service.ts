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

  findAll(userId: number): Promise<Income[]> {
    return this.incomesRepository.find({ where: { userId } });
  }

  findOne(id: number, userId: number): Promise<Income | null> {
    return this.incomesRepository.findOneByOrFail({ id, userId });
  }

  async create(createIncomeDTO: CreateIncomeDTO, userId: number) {
    const income = await this.incomesRepository.save({
      ...createIncomeDTO,
      userId,
    });
    return this.findOne(income.id, userId);
  }

  async update(id: number, updateIncomeDTO: UpdateIncomeDTO, userId: number) {
    const income = await this.findOne(id, userId);
    return this.incomesRepository.save({ ...income, ...updateIncomeDTO });
  }

  getIncomesByMonth(month: Date, userId: number) {
    return this.incomesRepository.find({
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

  findAllTypes() {
    return this.incomeTypeRepository.find();
  }

  delete(id: number, userId: number) {
    return this.incomesRepository.delete({ id, userId });
  }
}
