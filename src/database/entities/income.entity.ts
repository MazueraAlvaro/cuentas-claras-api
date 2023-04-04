import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { IncomeType } from './income-type.entity';

@Entity()
export class Income {
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

  @Column({ type: 'date', nullable: true })
  startAt: Date;

  @Column({ type: 'date', nullable: true })
  endAt: Date;

  @ManyToOne(() => IncomeType, (incomeType) => incomeType.incomes, {
    eager: true,
  })
  @JoinTable()
  incomeType: IncomeType;
}
