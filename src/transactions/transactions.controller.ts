import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { TransactionDTO } from './dto/transaction.dto';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { TX_PARSED_EVENT, TxParsedEvent } from 'src/events/tx-parsed.event';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { CreateCreditCardDTO } from './dto/create-credit-card.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionService) {}

  @Post('/register')
  registerTransaction(
    @Body() body: TransactionDTO,
    @CurrentUser() user: User,
  ) {
    return this.transactionsService.registerTransaction(body, user.id);
  }

  @EventPattern(TX_PARSED_EVENT)
  handleTransactionParsed(
    @Payload() data: TxParsedEvent,
    @Ctx() context: RmqContext,
  ) {
    try {
      this.transactionsService.registerTransactionFromQueue(data, context);
    } catch (error) {
      console.error('Error processing transaction parsed event:', error);
      return;
    }
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    return channel.ack(originalMsg);
  }

  @Get('/credit-cards')
  getCreditCards(@CurrentUser() user: User) {
    return this.transactionsService.getCreditCards(user.id);
  }

  @Post('/credit-cards')
  createCreditCard(
    @Body() body: CreateCreditCardDTO,
    @CurrentUser() user: User,
  ) {
    return this.transactionsService.createCreditCard(body, user.id);
  }

  @Get('/by-cards')
  getTransactionsByCards(
    @Query('from') fromDate: string,
    @Query('to') toDate: string,
    @CurrentUser() user: User,
  ) {
    return this.transactionsService.getTransactionsByCard(
      fromDate,
      toDate,
      user.id,
    );
  }

  @Get('/transaction-categories')
  getCategoryList() {
    return this.transactionsService.getCategoryList();
  }

  @Put(':transactionId')
  updateTransaction(
    @Body() body: TransactionDTO,
    @Param('transactionId') transactionId: string,
  ) {
    return this.transactionsService.updateTransaction(+transactionId, body);
  }

  @Get('/category-summary')
  getCategorySummary(
    @Query('from') fromDate: string,
    @Query('to') toDate: string,
    @CurrentUser() user: User,
  ) {
    return this.transactionsService.getCategorySummary(
      fromDate,
      toDate,
      user.id,
    );
  }

  @Post('/create')
  createTransaction(
    @Body() body: CreateTransactionDTO,
    @CurrentUser() user: User,
  ) {
    return this.transactionsService.createTransaction(body, user.id);
  }
}
