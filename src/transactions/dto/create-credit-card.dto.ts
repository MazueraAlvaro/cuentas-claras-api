import { IsInt, IsString, Min } from 'class-validator';

export class CreateCreditCardDTO {
  @IsString()
  lastDigits: string;

  @IsString()
  bank: string;

  @IsString()
  franchise: string;

  @IsInt()
  @Min(0)
  limit: number;

  @IsInt()
  closingDay: number;

  @IsString()
  name: string;
}
