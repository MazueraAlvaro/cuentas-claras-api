import { MonthStatus } from 'src/enums/month-status.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MonthExpense } from './month-expense.entity';
import { MonthIncome } from './month-income.entity';
import { User } from './user.entity';

@Entity()
export class Month {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'date', nullable: false })
  month: Date;

  @Column({ type: 'enum', enum: MonthStatus, default: MonthStatus.OPEN })
  status: MonthStatus;

  @Column({ default: 0 })
  totalIncomes: number;

  @Column({ default: 0 })
  totalExpenses: number;

  @Column({ default: 0 })
  difference: number;

  @Column({ default: 0 })
  currentBalance: number;

  @Column({ default: 0 })
  totalUnpaid: number;

  @OneToMany(() => MonthIncome, (monthIncome) => monthIncome.month, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  monthIncomes: MonthIncome[];

  @OneToMany(() => MonthExpense, (monthExpense) => monthExpense.month, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  monthExpenses: MonthExpense[];
}
