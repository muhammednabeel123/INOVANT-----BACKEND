import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number

    @Column({ nullable: true })
    userName: string

    @Column({ nullable: true })
    firstName: string

    @Column({ nullable: true })
    lastName: string

    @Column({ nullable: true })
    age: number

    @Column('bigint')
    phoneNo: number

}
