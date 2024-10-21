import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  name: string;

  @Column()
  price: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['V', 'N'],
    nullable: true
  })
  category: 'V' | 'N'

  @Column({ nullable: true })
  typeId: number;

  @Column('simple-array', { nullable: true })
  images: string[]; 

  @Column({ nullable: true })
  adminId: number;

  @Column({ default: 0, nullable: true })
  isDeleted: number;

  @Column({  default: 1, nullable: true })
  isActive: number;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ default: 0 })
  isTodaysMenu: number;

  @Column({ default: 0 })
  isTodaySpecl: number;

}
