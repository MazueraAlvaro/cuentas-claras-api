import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateMonthExpenseDTO {
  @IsOptional()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsBoolean()
  paid: boolean;

  @IsOptional()
  @IsBoolean()
  creditCard: boolean;
}
