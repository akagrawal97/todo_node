"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
require("reflect-metadata");
const userEntity_1 = require("../entities/userEntity");
const user_groupsEntity_1 = require("../entities/user_groupsEntity");
const groupsEntity_1 = require("../entities/groupsEntity");
const activitiesEntity_1 = require("../entities/activitiesEntity");
exports.configuration = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "vertrigo",
    database: "tododbnew",
    entities: [userEntity_1.userEntity, user_groupsEntity_1.user_groupsEntity, groupsEntity_1.groupsEntity, activitiesEntity_1.activitiesEntity],
    synchronize: false
};
