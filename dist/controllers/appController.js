"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateActivityStatus = exports.fetchActivities = exports.showAllUsers = exports.addActivity = exports.addActivityGroup = exports.fetchgroups = exports.login = exports.register = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const groupsEntity_1 = require("../entities/groupsEntity");
const activitiesEntity_1 = require("../entities/activitiesEntity");
const user_groupsEntity_1 = require("../entities/user_groupsEntity");
const userEntity_1 = require("../entities/userEntity");
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = bcrypt.hashSync(req.body.password, 0);
    let user = new userEntity_1.userEntity();
    user.emp_id = req.body.emp_id;
    user.password = hashedPassword;
    try {
        let isUsernameTaken = yield typeorm_1.getManager().getRepository(userEntity_1.userEntity).findOneById(user.emp_id);
        if (isUsernameTaken) {
            res.send({
                message: "username already taken"
            });
        }
        else {
            let savedUser = typeorm_1.getManager().getRepository(userEntity_1.userEntity).save(user);
            res.send({
                emp_id: (yield savedUser).emp_id,
                password: (yield savedUser).password,
                message: "Registration Successful"
            });
        }
    }
    catch (error) {
        console.log(error);
        res.send({
            message: "an error occurred"
        });
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = bcrypt.hashSync(req.body.password, 0);
    try {
        let user = yield typeorm_1.getManager().getRepository(userEntity_1.userEntity).findOneById(req.body.emp_id);
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.uid = user.emp_id;
                res.send({
                    message: "Login Successful"
                });
            }
            else {
                res.send({
                    message: "wrong password"
                });
            }
        }
        else {
            res.send({
                message: "wrong username"
            });
        }
    }
    catch (error) {
        console.log(error);
        res.send({
            message: "an error occurred",
            error: error
        });
    }
});
exports.fetchgroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = req.session.uid;
    if (uid) {
        try {
            var group_ids = new Array();
            let user_groups = yield typeorm_1.getManager().getRepository(user_groupsEntity_1.user_groupsEntity).find();
            user_groups.map((user_group) => {
                if (user_group.emp_id === uid) {
                    group_ids.push(user_group.group_id);
                }
            });
            let user_names = yield typeorm_1.getManager().getRepository(groupsEntity_1.groupsEntity).findByIds(group_ids);
            res.send(user_names);
        }
        catch (error) {
            console.log(error);
            res.send({
                message: "an error occurred"
            });
        }
    }
    else {
        res.send({
            message: "login to fetch groups"
        });
    }
});
exports.addActivityGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = req.session.uid;
    if (uid) {
        try {
            let group = new groupsEntity_1.groupsEntity();
            group.group_name = req.body.group_name;
            let createdGroup = yield typeorm_1.getManager().getRepository(groupsEntity_1.groupsEntity).save(group);
            console.log("created group:");
            console.log(createdGroup);
            //console.log(createdGroup.group_name);
            let createdGroupId = createdGroup.group_id;
            let user_group = new user_groupsEntity_1.user_groupsEntity();
            user_group.group_id = createdGroupId;
            user_group.emp_id = uid;
            let createdUser_group = yield typeorm_1.getManager().getRepository(user_groupsEntity_1.user_groupsEntity).save(user_group);
            res.send({
                message: "new group created",
                createdGroupId: createdGroupId,
                createdUser_groupId: createdUser_group.id
            });
        }
        catch (error) {
            console.log(error);
            res.send({
                message: "an error occurred"
            });
        }
    }
    else {
        res.send({
            message: "login to add groups"
        });
    }
});
exports.addActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = req.session.uid;
    if (uid) {
        let group_id = req.body.group_id;
        let query = "select * from user_groups where emp_id='" + uid + "' and group_id=" + group_id;
        let user_group_exists = yield typeorm_1.getManager().query(query);
        let sizeOfuser_group_exists = Object.keys(user_group_exists).length;
        if (sizeOfuser_group_exists > 0) {
            try {
                let activity = new activitiesEntity_1.activitiesEntity();
                activity.group_id = group_id;
                activity.activity_name = req.body.activity_name;
                activity.isCompleted = false;
                let savesActivity = yield typeorm_1.getManager().getRepository(activitiesEntity_1.activitiesEntity).save(activity);
                res.send({
                    message: "activity created",
                    activity: savesActivity
                });
            }
            catch (error) {
                console.log(error);
                res.send({
                    message: "an error occurred"
                });
            }
        }
        else {
            res.send({
                message: "group doesnot exist"
            });
        }
    }
    else {
        res.send({
            message: "login to add activity"
        });
    }
});
exports.showAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield typeorm_1.getManager().query(`SELECT * FROM USER`);
    res.send(users);
});
exports.fetchActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = req.session.uid;
    if (uid) {
        let group_id = req.body.group_id;
        let query1 = "select * from user_groups where emp_id='" + uid + "' and group_id=" + group_id;
        let user_group_exists = yield typeorm_1.getManager().query(query1);
        let sizeOfuser_group_exists = Object.keys(user_group_exists).length;
        if (sizeOfuser_group_exists > 0) {
            try {
                let query2 = "select * from activities where group_id=" + group_id;
                let allActivities = yield typeorm_1.getManager().query(query2);
                res.send({
                    message: "activities fetched",
                    activities: allActivities
                });
            }
            catch (error) {
                console.log(error);
                res.send({
                    message: "an error occurred"
                });
            }
        }
        else {
            res.send({
                message: "group doesnot exist"
            });
        }
    }
    else {
        res.send({
            message: "login to add activity"
        });
    }
});
exports.updateActivityStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = req.session.uid;
    if (uid) {
        let group_id = req.body.group_id;
        let query = "select * from user_groups where emp_id='" + uid + "' and group_id=" + group_id;
        let user_group_exists = yield typeorm_1.getManager().query(query);
        let sizeOfuser_group_exists = Object.keys(user_group_exists).length;
        if (sizeOfuser_group_exists > 0) {
            try {
                let currentActivity = yield typeorm_1.getManager().getRepository(activitiesEntity_1.activitiesEntity).findOneById(req.body.activity_id);
                let activity = new activitiesEntity_1.activitiesEntity();
                activity.id = currentActivity.id;
                activity.group_id = currentActivity.group_id;
                activity.activity_name = currentActivity.activity_name;
                activity.isCompleted = !currentActivity.isCompleted;
                let savedActivity = yield typeorm_1.getManager().getRepository(activitiesEntity_1.activitiesEntity).save(activity);
                res.send({
                    message: "activity updated",
                    activity: savedActivity
                });
            }
            catch (error) {
                console.log(error);
                res.send({
                    message: "an error occurred"
                });
            }
        }
        else {
            res.send({
                message: "group doesnot exist"
            });
        }
    }
    else {
        res.send({
            message: "login to add activity"
        });
    }
});
