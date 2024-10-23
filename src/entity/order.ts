import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity()
export class Orders {

    @PrimaryGeneratedColumn()
    orderId: number

    @Column()
    orderNo: number

    @Column()
    userId: number

    @Column({ default: 0, nullable: true })
    isProcessed:number

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @Column({
        type: 'enum',
        enum: ['U', 'T'], //U = User, T = Table
        default:'T',
        nullable: true,
    })
    orderType: 'U' | 'D'

}
