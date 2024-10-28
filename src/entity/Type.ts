import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Admin } from "./admin"

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

    @Column('simple-array', { nullable: true })
    images: string[];

    @Column({ nullable: true })
    adminId: number;
}


