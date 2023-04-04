import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Income } from './income.entity';

@Entity()
export class IncomeType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Income, (income) => income.incomeType)
  incomes: Income[];
}
