import {Entity, Column,  PrimaryGeneratedColumn} from "typeorm";

@Entity("groups")
export class groupsEntity {

    @PrimaryGeneratedColumn("increment")
    group_id: number;

    @Column()
    group_name: string;

}