import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"
import { Product } from "./product"

@Entity()
export class OrderItems {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    orderId: number

    @Column()
    quantity: number

    @ManyToOne(() => Product)
    productId: Product

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date
}
