import "reflect-metadata";
import {ConnectionOptions} from "typeorm";
import { userEntity } from "../entities/userEntity";
import { user_groupsEntity } from "../entities/user_groupsEntity";
import { groupsEntity } from "../entities/groupsEntity";
import { activitiesEntity } from "../entities/activitiesEntity";



 export let configuration: ConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "vertrigo",
    database: "tododbnew",
    entities: [ userEntity, user_groupsEntity, groupsEntity, activitiesEntity ],
    synchronize: false
}