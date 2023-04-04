import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ExpenseType } from './expense-type.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  isRecurring: boolean;

  @Column()
  dueDay: number;

  @Column({ type: 'date', nullable: true })
  startAt: Date;

  @Column({ type: 'date', nullable: true })
  endAt: Date;

  @ManyToOne(() => ExpenseType, (expenseType) => expenseType.expenses)
  expenseType: ExpenseType;
}
