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
import { UpdateIncomeDTO } from './dto/income-update.dto';
import { CreateIncomeDTO } from './dto/income.dto';
import { IncomesService } from './incomes.service';

@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Get('/')
  findAll(@CurrentUser() user: User) {
    return this.incomesService.findAll(user.id);
  }

  @Get('/types')
  getTypes() {
    return this.incomesService.findAllTypes();
  }

  @Get('/:id')
  async findById(@Param('id') id: number, @CurrentUser() user: User) {
    try {
      return await this.incomesService.findOne(id, user.id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Post('/')
  create(@Body() createIncomeDTO: CreateIncomeDTO, @CurrentUser() user: User) {
    return this.incomesService.create(createIncomeDTO, user.id);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateIncomeDTO: UpdateIncomeDTO,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.incomesService.update(id, updateIncomeDTO, user.id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete('/:id')
  delete(@Param('id') id: number, @CurrentUser() user: User) {
    return this.incomesService.delete(id, user.id);
  }
}
