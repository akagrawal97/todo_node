import {Entity, Column,  PrimaryGeneratedColumn} from "typeorm";

@Entity("activities")
export class activitiesEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    group_id: number;

    @Column()
    activity_name: string;

    @Column()
    isCompleted: boolean;
}