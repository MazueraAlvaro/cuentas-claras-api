import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateMonthExpenseDTO } from './dto/month-expense-update.dto';
import { UpdateMonthIncomeDTO } from './dto/month-income-update.dto';
import { MonthsService } from './months.service';

@Controller('months')
export class MonthsController {
  constructor(private readonly monthsService: MonthsService) {}

  @Get('/:month')
  findMonthById(@Param('month') month: number) {
    return this.monthsService.findById(month);
  }

  @Get('/byDate/:date')
  async findByDate(@Param('date') date: Date) {
    try {
      return await this.monthsService.findByDate(date);
    } catch (error) {
      throw new NotFoundException('Mes no encontrado');
    }
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

  @Patch('/:month/monthExpenses/:monthExpense')
  updateMonthExpense(
    @Param('monthExpense', ParseIntPipe) monthExpenseId: number,
    @Param('month', ParseIntPipe) monthId: number,
    @Body() updateMonthExpenseDTO: UpdateMonthExpenseDTO,
  ) {
    return this.monthsService.updateExpenseByMonthExpenseId(
      monthId,
      monthExpenseId,
      updateMonthExpenseDTO,
    );
  }

  @Patch('/:month/monthIncomes/:monthIncome')
  updateMonthIncome(
    @Param('monthIncome', ParseIntPipe) monthIncomeId: number,
    @Param('month', ParseIntPipe) monthId: number,
    @Body() updateMonthIncomeDTO: UpdateMonthIncomeDTO,
  ) {
    return this.monthsService.updateIncomeByMonthIncomeId(
      monthId,
      monthIncomeId,
      updateMonthIncomeDTO,
    );
  }
}
