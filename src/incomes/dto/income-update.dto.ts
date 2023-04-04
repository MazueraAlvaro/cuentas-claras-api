import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { IncomeType } from 'src/database/entities/income-type.entity';

export class UpdateIncomeDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsBoolean()
  @IsOptional()
  isRecurring: boolean;

  @IsOptional()
  @IsDateString()
  startAt: Date;

  @IsOptional()
  @IsDateString()
  endAt: Date;

  @IsNumber()
  @IsOptional()
  incomeType: IncomeType;
}
