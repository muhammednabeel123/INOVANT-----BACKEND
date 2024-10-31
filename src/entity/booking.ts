import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Orders } from "./order";

@Entity()
export class Booking {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cust_name: string;

    @Column()
    cust_no: string;

    @Column()
    cust_email: string;

    @Column()
    members: number;

    @Column()
    booking_date: Date; 

    @Column()
    booking_time: string;

    @Column({ default: 0 })
    visited: number;

    @Column({ default: 0 })
    acceptedByAdmin: number;

    @Column({ default: 0 })
    isDeleted: number;
}
