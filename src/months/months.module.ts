import { Module } from '@nestjs/common';
import { MonthsService } from './months.service';
import { MonthsController } from './months.controller';
import { Month } from 'src/database/entities/month.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomesModule } from 'src/incomes/incomes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Month]), IncomesModule],
  providers: [MonthsService],
  controllers: [MonthsController],
})
export class MonthsModule {}
