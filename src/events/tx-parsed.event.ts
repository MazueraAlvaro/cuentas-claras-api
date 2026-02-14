export const TX_PARSED_EVENT = "tx.parsed";

export enum TransactionType {
    PURCHASE = "compra",
    TRANSFER = "transferencia",
    PAYMENT = "pago",
    WITHDRAWAL = "retiro",
    ADVANCE = "avance",
    CHARGE = "cargo",
    DEPOSIT = "abono"
}

export interface TransactionPayload {
    bank: string;
    amount: number;
    currency: string;
    datetime: string;
    merchant: string;
    accountLast4: string;
    transactionType: TransactionType
}

export class TxParsedEvent {
    eventId: string;
    occurredAt: Date;
    idempotencyKey: string;
    rawText: string;
    transaction: TransactionPayload;
}