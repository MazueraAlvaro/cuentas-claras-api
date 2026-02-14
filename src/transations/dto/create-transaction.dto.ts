import { IsDateString, IsNumber, IsObject, IsString } from 'class-validator';
import { TransactionCategory } from 'src/database/entities/transaction-category.entity';

export class CreateTransactionDTO {
  @IsDateString()
  datetime: Date;

  @IsString()
  bank: string;

  @IsString()
  merchant: string;

  @IsNumber()
  amount: number;

  @IsString()
  type: string;

  @IsString()
  cardLastDigits: string;

  @IsNumber()
  category: number;

  @IsNumber()
  creditCardId: number;
}
