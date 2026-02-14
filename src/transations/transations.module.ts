import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CreditCard } from 'src/database/entities/credit-card.entity';
import { Transaction } from 'src/database/entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionCategory } from 'src/database/entities/transaction-category.entity';

@Module({
  providers: [TransactionService],
  controllers: [TransactionsController],
  imports: [
    TypeOrmModule.forFeature([Transaction, CreditCard, TransactionCategory]),
  ],
})
export class TransationsModule {}
