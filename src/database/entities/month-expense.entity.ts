import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from './expense.entity';
import { Month } from './month.entity';

@Entity()
export class MonthExpense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  monthId: number;

  @Column()
  expenseId: number;

  @Column()
  amount: number;

  @Column()
  paid: boolean;

  @ManyToOne(() => Month, (month) => month.monthExpenses, {
    orphanedRowAction: 'delete',
  })
  public month: Month;

  @ManyToOne(() => Expense, (expense) => expense.monthExpenses)
  public expense: Expense;
}
