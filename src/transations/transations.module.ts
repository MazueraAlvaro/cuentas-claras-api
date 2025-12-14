import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CreditCard } from 'src/database/entities/credit-card.entity';
import { Transaction } from 'src/database/entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    providers: [TransactionService],
    controllers: [TransactionsController],
    imports: [TypeOrmModule.forFeature([Transaction, CreditCard])],
})
export class TransationsModule {}
