import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreditCard } from './credit-card.entity';
import { TransactionCategory } from './transaction-category.entity';

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

  @Column({ default: false })
  approved: boolean;

  @Column({ unique: true })
  idempotencyKey: string;

  @ManyToOne(() => CreditCard, (creditCard) => creditCard.transactions, {
    nullable: true,
  })
  @JoinTable()
  creditCard?: CreditCard | null;

  @ManyToOne(() => TransactionCategory, (category) => category.transactions, {
    nullable: true,
  })
  @JoinTable()
  category?: TransactionCategory | null;
}
