import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Status {

    @PrimaryGeneratedColumn()
    statusId: number;

    @Column({ nullable: true })
    name: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
