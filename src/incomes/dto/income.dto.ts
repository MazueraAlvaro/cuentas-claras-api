import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { IncomeType } from 'src/database/entities/income-type.entity';

export class CreateIncomeDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsBoolean()
  isRecurring: boolean;

  @IsOptional()
  @IsDateString()
  startAt: Date;

  @IsOptional()
  @IsDateString()
  endAt: Date;

  @IsNumber()
  incomeType: IncomeType;
}
