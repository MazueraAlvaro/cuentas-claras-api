import { Controller, Get, Param, Query } from '@nestjs/common';
import { AccumulatedService } from './accumulates.service';

@Controller('accumulated')
export class AccumulatedController {
  constructor(private readonly accumulatedService: AccumulatedService) {}
  @Get('/')
  findAll(@Query('from') fromDate: string, @Query('to') toDate: string) {
    return this.accumulatedService.getExpensesAccumulated(fromDate, toDate);
  }

  @Get(':expenseId')
  findByExpense(
    @Query('from') fromDate: string,
    @Query('to') toDate: string,
    @Param('expenseId') expenseId: number,
  ) {
    return this.accumulatedService.getExpenseAccumulated(
      fromDate,
      toDate,
      expenseId,
    );
  }
}
