import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateExpenseDTO } from './dto/expense-update.dto';
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

  @Patch('/:id')
  update(@Param('id') id: number, @Body() updateExpenseDTO: UpdateExpenseDTO) {
    return this.expensesService.update(id, updateExpenseDTO);
  }
}
