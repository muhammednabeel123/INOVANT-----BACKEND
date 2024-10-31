import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    img: string

    @Column({ nullable: true })
    title: string

    @Column({ nullable: true })
    description: string

    @Column({ default: 1 })
    status: number
}
