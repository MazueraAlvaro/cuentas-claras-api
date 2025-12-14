import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "src/database/entities/transaction.entity";
import { TransactionDTO } from "./dto/transaction.dto";
import { Repository } from "typeorm";
import { CreditCard } from "src/database/entities/credit-card.entity";

@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(CreditCard)
        private readonly creditCardRepository: Repository<CreditCard>,
    ) {}

    async registerTransaction(transactionDTO: TransactionDTO) {
        const transactionData = {...transactionDTO} as Transaction;
        const cc = await this.creditCardRepository.findOneBy({ lastDigits: transactionDTO.cardLastDigits })
        if (cc) {
            transactionData.creditCard = cc;
        }
        const transaction = this.transactionRepository.create(transactionData);
        return this.transactionRepository.save(transaction);
    }
}