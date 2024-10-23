import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"
import { Product } from "./product"

@Entity()
export class OrderItems {

    @PrimaryGeneratedColumn()
    orderItemId: number

    @Column()
    orderId: number

    @Column()
    quantity: number

    @Column()
    productId: number

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date
}
