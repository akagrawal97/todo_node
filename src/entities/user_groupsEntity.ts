import {Entity, Column,  PrimaryGeneratedColumn} from "typeorm";

@Entity("user_groups")
export class user_groupsEntity {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    emp_id: string;

    @Column()
    group_id: number;
}