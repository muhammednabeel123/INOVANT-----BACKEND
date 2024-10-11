import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Admin {
    static find() {
        throw new Error("Method not implemented.")
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number
}
