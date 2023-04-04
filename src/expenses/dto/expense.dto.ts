import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ExpenseType } from 'src/database/entities/expense-type.entity';

export class CreateExpenseDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsBoolean()
  isRecurring: boolean;

  @IsNumber()
  dueDay: number;

  @IsOptional()
  @IsDateString()
  startAt: Date;

  @IsOptional()
  @IsDateString()
  endAt: Date;

  @IsNumber()
  expenseType: ExpenseType;
}
