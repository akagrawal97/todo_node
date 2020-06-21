import {Entity, Column,  PrimaryColumn} from "typeorm";

@Entity("user")
export class userEntity {

    @PrimaryColumn()
    emp_id: string;

    @Column()
    password: string;

}