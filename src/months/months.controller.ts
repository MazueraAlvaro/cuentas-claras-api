import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { UpdateMonthExpenseDTO } from './dto/month-expense-update.dto';
import { UpdateMonthIncomeDTO } from './dto/month-income-update.dto';
import { MonthsService } from './months.service';

@Controller('months')
export class MonthsController {
  constructor(private readonly monthsService: MonthsService) {}

  @Get('/:month')
  findMonthById(
    @Param('month') month: number,
    @CurrentUser() user: User,
  ) {
    return this.monthsService.findById(month, user.id);
  }

  @Get('/byDate/:date')
  async findByDate(@Param('date') date: Date, @CurrentUser() user: User) {
    try {
      return await this.monthsService.findByDate(date, user.id);
    } catch (error) {
      throw new NotFoundException('Mes no encontrado');
    }
  }

  @Post('/generate/:month')
  generateMonth(@Param('month') month: Date, @CurrentUser() user: User) {
    return this.monthsService.generateMonth(month, user.id);
  }

  @Post('/close/:monthId')
  closeMonth(
    @Param('monthId', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.monthsService.closeMonthById(id, user.id);
  }

  @Post('/:month/addExpense/:expense')
  addExpense(
    @Param('expense') expenseId: number,
    @Param('month') monthId: number,
    @CurrentUser() user: User,
  ) {
    return this.monthsService.addExpenseById(monthId, expenseId, user.id);
  }

  @Delete('/:month/deleteMonthExpense/:monthExpense')
  deleteMonthExpense(
    @Param('monthExpense', ParseIntPipe) monthExpenseId: number,
    @Param('month', ParseIntPipe) monthId: number,
    @CurrentUser() user: User,
  ) {
    return this.monthsService.deleteMonthExpenseById(
      monthId,
      monthExpenseId,
      user.id,
    );
  }

  @Delete('/:month/deleteMonthIncome/:monthIncome')
  deleteMonthIncome(
    @Param('monthIncome', ParseIntPipe) monthIncomeId: number,
    @Param('month', ParseIntPipe) monthId: number,
    @CurrentUser() user: User,
  ) {
    return this.monthsService.deleteMonthIncomeById(
      monthId,
      monthIncomeId,
      user.id,
    );
  }

  @Post('/:month/addIncome/:expense')
  addIncome(
    @Param('expense') incomeId: number,
    @Param('month') monthId: number,
    @CurrentUser() user: User,
  ) {
    return this.monthsService.addIncomeById(monthId, incomeId, user.id);
  }

  @Patch('/:month/monthExpenses/:monthExpense')
  updateMonthExpense(
    @Param('monthExpense', ParseIntPipe) monthExpenseId: number,
    @Param('month', ParseIntPipe) monthId: number,
    @Body() updateMonthExpenseDTO: UpdateMonthExpenseDTO,
    @CurrentUser() user: User,
  ) {
    return this.monthsService.updateExpenseByMonthExpenseId(
      monthId,
      monthExpenseId,
      updateMonthExpenseDTO,
      user.id,
    );
  }

  @Patch('/:month/monthIncomes/:monthIncome')
  updateMonthIncome(
    @Param('monthIncome', ParseIntPipe) monthIncomeId: number,
    @Param('month', ParseIntPipe) monthId: number,
    @Body() updateMonthIncomeDTO: UpdateMonthIncomeDTO,
    @CurrentUser() user: User,
  ) {
    return this.monthsService.updateIncomeByMonthIncomeId(
      monthId,
      monthIncomeId,
      updateMonthIncomeDTO,
      user.id,
    );
  }
}
