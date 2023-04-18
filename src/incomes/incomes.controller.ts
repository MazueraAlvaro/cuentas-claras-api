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
import { UpdateIncomeDTO } from './dto/income-update.dto';
import { CreateIncomeDTO } from './dto/income.dto';
import { IncomesService } from './incomes.service';

@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}
  @Get('/')
  findAll() {
    return this.incomesService.findAll();
  }

  @Get('/types')
  getTypes() {
    return this.incomesService.findAllTypes();
  }

  @Get('/:id')
  async findById(@Param('id') id: number) {
    try {
      return await this.incomesService.findOne(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Post('/')
  create(@Body() createIncomeDTO: CreateIncomeDTO) {
    return this.incomesService.create(createIncomeDTO);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateIncomeDTO: UpdateIncomeDTO,
  ) {
    try {
      return await this.incomesService.update(id, updateIncomeDTO);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.incomesService.delete(id);
  }
}
