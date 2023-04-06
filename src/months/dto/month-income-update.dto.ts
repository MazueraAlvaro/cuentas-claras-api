import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateMonthIncomeDTO {
  @IsOptional()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsBoolean()
  received: boolean;
}
