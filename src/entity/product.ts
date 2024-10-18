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

  @Column({ nullable: true })
  isDeleted: number;

  @Column({ nullable: true })
  isActive: number;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ default: 0 })
  isFeatured: number;

  @Column({ default: 0 })
  isTodaySpecl: number;

}
