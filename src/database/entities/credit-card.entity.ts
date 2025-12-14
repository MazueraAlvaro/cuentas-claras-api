import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./transaction.entity";

@Entity()
export class CreditCard {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    lastDigits: string;

    @Column()
    bank: string

    @Column()
    franchise: string;

    @Column()
    limit: number;

    @Column()
    closingDay: number;

    @Column()
    name: string;

    @OneToMany(() => Transaction, (transaction) => transaction.creditCard)
    transactions: Transaction[];

}