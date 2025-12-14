import { Body, Controller, Post } from "@nestjs/common";
import { TransactionService } from "./transactions.service";
import { TransactionDTO } from "./dto/transaction.dto";

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionService) {}

    @Post('/register')
    registerTransaction(@Body() body: TransactionDTO) {
        return this.transactionsService.registerTransaction(body);
    }
}