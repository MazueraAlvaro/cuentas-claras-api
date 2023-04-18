import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from 'src/database/entities/income.entity';
import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';
import { IncomeType } from 'src/database/entities/income-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income, IncomeType])],
  controllers: [IncomesController],
  providers: [IncomesService],
  exports: [IncomesService],
})
export class IncomesModule {}
