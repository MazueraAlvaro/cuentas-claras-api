import { IsDate, IsDateString, IsNumber, IsString } from "class-validator";

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
}