import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonthIncome } from 'src/database/entities/month-income.entity';
import { Month } from 'src/database/entities/month.entity';
import { MonthStatus } from 'src/enums/month-status.enum';
import { IncomesService } from 'src/incomes/incomes.service';
import { Repository } from 'typeorm';

@Injectable()
export class MonthsService {
  constructor(
    @InjectRepository(Month)
    private readonly monthRepository: Repository<Month>,
    private readonly incomesService: IncomesService,
  ) {}
  async generateMonth(month: Date) {
    const exists = await this.monthRepository.findOne({ where: { month } });
    if (exists) {
      throw new ForbiddenException({
        error: true,
        message: 'Month already exists',
      });
    }
    const incomes = await this.incomesService.getIncomesByMonth(month);
    console.log(incomes);
    const monthIncomes = incomes.map((income) => {
      const monthIncome = new MonthIncome();
      monthIncome.income = income;
      monthIncome.amount = income.amount;
      monthIncome.received = false;
      return monthIncome;
    });
    const monthEntity = new Month();
    monthEntity.month = month;
    monthEntity.status = MonthStatus.OPEN;
    monthEntity.monthIncomes = monthIncomes;

    return this.monthRepository.save(monthEntity);
  }
}
