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
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { UpdateExpenseDTO } from './dto/expense-update.dto';
import { CreateExpenseDTO } from './dto/expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('/')
  findAll(@CurrentUser() user: User) {
    return this.expensesService.findAll(user.id);
  }

  @Get('/types')
  getTypes() {
    return this.expensesService.findAllTypes();
  }

  @Get('/:id')
  async findById(@Param('id') id: number, @CurrentUser() user: User) {
    try {
      return await this.expensesService.findOne(id, user.id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Post('/')
  create(@Body() createExpenseDTO: CreateExpenseDTO, @CurrentUser() user: User) {
    return this.expensesService.create(createExpenseDTO, user.id);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateExpenseDTO: UpdateExpenseDTO,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.expensesService.update(id, updateExpenseDTO, user.id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete('/:id')
  delete(@Param('id') id: number, @CurrentUser() user: User) {
    return this.expensesService.delete(id, user.id);
  }
}
