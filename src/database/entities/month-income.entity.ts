import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Income } from './income.entity';
import { Month } from './month.entity';

@Entity()
export class MonthIncome {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  monthId: number;

  @Column()
  incomeId: number;

  @Column()
  amount: number;

  @Column()
  received: boolean;

  @ManyToOne(() => Month, (month) => month.monthIncomes, {
    orphanedRowAction: 'delete',
  })
  public month: Month;

  @ManyToOne(() => Income, (income) => income.monthIncomes)
  public income: Income;
}
