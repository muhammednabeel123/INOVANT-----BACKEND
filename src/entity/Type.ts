import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Type {

    @PrimaryGeneratedColumn()
    typeId: number

    @Column({ nullable: true })
    name: string

    @Column({ nullable: true, default: 0 })
    isDeleted: number

    @Column({ nullable: true, default: 0 })
    isActive: number

}


