import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/database/entities/transaction.entity';
import { TransactionDTO } from './dto/transaction.dto';
import { IsNull, Not, Repository } from 'typeorm';
import { CreditCard } from 'src/database/entities/credit-card.entity';
import { TxParsedEvent } from 'src/events/tx-parsed.event';
import { RmqContext } from '@nestjs/microservices';
import { TransactionCategory } from 'src/database/entities/transaction-category.entity';
import { CreateTransactionDTO } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(CreditCard)
    private readonly creditCardRepository: Repository<CreditCard>,
    @InjectRepository(TransactionCategory)
    private readonly transactionCategoryRepository: Repository<TransactionCategory>,
  ) {}

  async registerTransaction(transactionDTO: TransactionDTO) {
    const transactionData = { ...transactionDTO } as Transaction;
    const cc = await this.creditCardRepository.findOneBy({
      lastDigits: transactionDTO.cardLastDigits,
    });
    if (cc) {
      transactionData.creditCard = cc;
    }
    const transaction = this.transactionRepository.create(transactionData);
    return this.transactionRepository.save(transaction);
  }

  async registerTransactionFromQueue(
    eventData: TxParsedEvent,
    context: RmqContext,
  ) {
    const transactionObject = this.buildTransactionFromEvent(eventData);

    const cc = await this.creditCardRepository.findOneBy({
      lastDigits: eventData.transaction.accountLast4,
    });

    const prevTransaction = await this.transactionRepository.findOne({
      where: {
        merchant: eventData.transaction.merchant,
        category: Not(IsNull()),
      },
      relations: ['category'],
    });
    if (cc) {
      transactionObject.creditCard = cc;
    }
    if (prevTransaction) {
      transactionObject.category = prevTransaction.category;
    }

    const transaction = this.transactionRepository
      .createQueryBuilder()
      .insert()
      .values(transactionObject)
      .orIgnore()
      .updateEntity(false)
      .execute();
    return transaction;
  }

  buildTransactionFromEvent(eventData: TxParsedEvent): Transaction {
    const transaction = new Transaction();
    transaction.bank = eventData.transaction.bank;
    transaction.merchant = eventData.transaction.merchant;
    transaction.amount = eventData.transaction.amount;
    transaction.type = eventData.transaction.transactionType;
    transaction.datetime = new Date(eventData.transaction.datetime);
    transaction.cardLastDigits = eventData.transaction.accountLast4;
    transaction.idempotencyKey = eventData.idempotencyKey;
    return transaction;
  }

  getCreditCards() {
    return this.creditCardRepository.find({ relations: ['transactions'] });
  }

  async getTransactionsByCard(fromDate: string, toDate: string) {
    const data = await this.creditCardRepository
      .createQueryBuilder('creditCard')
      .leftJoinAndSelect(
        'creditCard.transactions',
        'transaction',
        'transaction.datetime BETWEEN :fromDate AND :toDate',
        { fromDate, toDate },
      )
      .leftJoinAndSelect('transaction.category', 'category')
      .getMany();

    return data.map((cc) => ({
      ...cc,
      totalAmount: this.calculateTotalAmount(cc.transactions),
      transactions: this.orderTransactionsByDate(cc.transactions),
    }));
  }

  getCategoryList() {
    return this.transactionCategoryRepository.find();
  }

  updateTransaction(transactionId: number, body: TransactionDTO) {
    return this.transactionRepository.update(
      { id: transactionId },
      {
        bank: body.bank,
        merchant: body.merchant,
        amount: body.amount,
        type: body.type,
        datetime: body.datetime,
        cardLastDigits: body.cardLastDigits,
        category: body.category,
      },
    );
  }

  private calculateTotalAmount(transactions: Transaction[]): number {
    return transactions.reduce((total, tx) => total + tx.amount, 0);
  }

  private orderTransactionsByDate(transactions: Transaction[]): Transaction[] {
    return transactions.sort(
      (a, b) => b.datetime.getTime() - a.datetime.getTime(),
    );
  }

  async getCategorySummary(fromDate: string, toDate: string) {
    const categories = await this.transactionCategoryRepository.find();

    const summary = await Promise.all(
      categories.map(async (category) => {
        const totalAmount = await this.transactionRepository
          .createQueryBuilder('transaction')
          .where('transaction.categoryId = :categoryId', {
            categoryId: category.id,
          })
          .andWhere('transaction.datetime BETWEEN :fromDate AND :toDate', {
            fromDate,
            toDate,
          })
          .select('SUM(transaction.amount)', 'sum')
          .getRawOne();

        return {
          category: category.name,
          totalAmount: parseInt(totalAmount.sum) || 0,
          percentageOfMax: category.maxAmount
            ? ((parseInt(totalAmount.sum) || 0) / category.maxAmount) * 100
            : 0,
        };
      }),
    );

    return summary;
  }

  async createTransaction(transactionDTO: CreateTransactionDTO) {
    const category = await this.transactionCategoryRepository.findOneBy({
      id: transactionDTO.category,
    });
    if (!category) {
      throw new Error('Category not found');
    }
    const creditCard = await this.creditCardRepository.findOneBy({
      id: transactionDTO.creditCardId,
    });
    if (!creditCard) {
      throw new Error('Credit card not found');
    }
    const transactionData = {
      ...transactionDTO,
      category,
      approved: true,
      idempotencyKey: transactionDTO.cardLastDigits + transactionDTO.datetime,
      creditCard,
    };
    return this.transactionRepository.save(transactionData);
  }
}
