import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity()
export class Orders {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    orderNo: number

    @ManyToOne(() => User)
    userId: User

    @Column()
    isProcessed: Boolean

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date
}
