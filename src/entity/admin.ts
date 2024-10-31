import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    adminId: number

    @Column({ nullable: true })
    firstName: string

    @Column({ nullable: true })
    lastName: string

    @Column({ default:0 })
    isDeleted: number

    @Column('bigint')
    phoneNo: number

    @Column({ default: 0 })
    isSuperAdmin: number
}
