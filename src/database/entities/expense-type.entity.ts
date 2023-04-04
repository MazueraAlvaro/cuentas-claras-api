import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Expense } from './expense.entity';

@Entity()
export class ExpenseType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Expense, (expense) => expense.expenseType)
  expenses: Expense[];
}
