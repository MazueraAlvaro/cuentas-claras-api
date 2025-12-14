import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreditCard } from "./credit-card.entity";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    datetime: Date;

    @Column()
    bank: string;

    @Column()
    merchant: string;

    @Column()
    amount: number;

    @Column()
    type: string;

    @Column()
    cardLastDigits: string;

    @Column( { default: false } )
    approved: boolean;

    @ManyToOne(() => CreditCard, (creditCard) => creditCard.transactions, {
        eager: true,
        nullable: true,
    })
    @JoinTable()
    creditCard?: CreditCard | null;
}