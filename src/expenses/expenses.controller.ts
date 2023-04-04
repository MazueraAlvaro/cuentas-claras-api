import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateExpenseDTO } from './dto/expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}
  @Get('/')
  findAll() {
    return this.expensesService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.expensesService.findOne(id);
  }

  @Post('/')
  create(@Body() createExpenseDTO: CreateExpenseDTO) {
    return this.expensesService.create(createExpenseDTO);
  }
}
