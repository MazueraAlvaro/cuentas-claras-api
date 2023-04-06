import { Controller, Get, Param, Post } from '@nestjs/common';
import { MonthsService } from './months.service';

@Controller('months')
export class MonthsController {
  constructor(private readonly monthsService: MonthsService) {}

  @Get('/:month')
  findMonthById(@Param('month') month: number) {
    return this.monthsService.findById(month);
  }

  @Post('/generate/:month')
  generateMonth(@Param('month') month: Date) {
    return this.monthsService.generateMonth(month);
  }

  @Post('/:month/addExpense/:expense')
  addExpense(
    @Param('expense') expenseId: number,
    @Param('month') monthId: number,
  ) {
    return this.monthsService.addExpenseById(monthId, expenseId);
  }

  @Post('/:month/addIncome/:expense')
  addIncome(
    @Param('expense') expenseId: number,
    @Param('month') monthId: number,
  ) {
    return this.monthsService.addIncomeById(monthId, expenseId);
  }
}
