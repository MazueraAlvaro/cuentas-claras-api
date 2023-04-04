import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ExpenseType } from 'src/database/entities/expense-type.entity';

export class UpdateExpenseDTO {
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

  @IsNumber()
  @IsOptional()
  dueDay: number;

  @IsOptional()
  @IsDateString()
  startAt: Date;

  @IsOptional()
  @IsDateString()
  endAt: Date;

  @IsNumber()
  @IsOptional()
  expenseType: ExpenseType;
}
