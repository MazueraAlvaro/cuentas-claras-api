import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./transaction.entity";
import { User } from "./user.entity";

@Entity()
export class CreditCard {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;

    @ManyToOne(() => User)
    user: User;

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