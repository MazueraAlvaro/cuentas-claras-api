import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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

  @Get('/types')
  getTypes() {
    return this.expensesService.findAllTypes();
  }

  @Get('/:id')
  async findById(@Param('id') id: number) {
    try {
      return await this.expensesService.findOne(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Post('/')
  create(@Body() createExpenseDTO: CreateExpenseDTO) {
    return this.expensesService.create(createExpenseDTO);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateExpenseDTO: UpdateExpenseDTO,
  ) {
    try {
      return await this.expensesService.update(id, updateExpenseDTO);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.expensesService.delete(id);
  }
}
