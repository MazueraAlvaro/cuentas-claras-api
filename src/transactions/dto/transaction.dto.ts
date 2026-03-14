import { IsDateString, IsNumber, IsObject, IsString } from 'class-validator';
import { TransactionCategory } from 'src/database/entities/transaction-category.entity';

export class TransactionDTO {
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

  @IsObject()
  category: TransactionCategory;
}
