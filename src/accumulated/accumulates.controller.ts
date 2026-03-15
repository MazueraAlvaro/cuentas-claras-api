import { Controller, Get, Param, Query } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { AccumulatedService } from './accumulates.service';

@Controller('accumulated')
export class AccumulatedController {
  constructor(private readonly accumulatedService: AccumulatedService) {}

  @Get('/')
  findAll(
    @Query('from') fromDate: string,
    @Query('to') toDate: string,
    @CurrentUser() user: User,
  ) {
    return this.accumulatedService.getExpensesAccumulated(
      fromDate,
      toDate,
      user.id,
    );
  }

  @Get(':expenseId')
  findByExpense(
    @Query('from') fromDate: string,
    @Query('to') toDate: string,
    @Param('expenseId') expenseId: number,
    @CurrentUser() user: User,
  ) {
    return this.accumulatedService.getExpenseAccumulated(
      fromDate,
      toDate,
      expenseId,
      user.id,
    );
  }
}
