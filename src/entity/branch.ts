import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Branch {
    @PrimaryGeneratedColumn()
    branchId: number;

    @Column()
    adminId: number

    @Column({ nullable: true })
    branchName: string;

    @Column({ nullable: true })
    pincode: string;

    @Column({ default: 0 })
    isDeleted: number;

    @Column({ default: 1 })
    isActive: number;
}
