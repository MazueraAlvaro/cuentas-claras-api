import { MonthStatus } from 'src/enums/month-status.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { MonthIncome } from './month-income.entity';

@Entity()
export class Month {
  @PrimaryGeneratedColumn()
  id: number;

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
  })
  @JoinTable()
  monthIncomes: MonthIncome[];
}
