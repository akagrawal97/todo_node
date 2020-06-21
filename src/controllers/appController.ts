import { Request, Response } from "express";
import { getManager } from "typeorm";
import * as bcrypt from "bcrypt";

import { groupsEntity } from "../entities/groupsEntity";
import { activitiesEntity } from "../entities/activitiesEntity";
import { user_groupsEntity } from "../entities/user_groupsEntity";
import { userEntity } from "../entities/userEntity";

export let register = async (req: Request, res: Response) => {

    const hashedPassword = bcrypt.hashSync(req.body.password, 0);

    let user:userEntity = new userEntity();
    user.emp_id = req.body.emp_id;
    user.password=hashedPassword;

    try{
        let isUsernameTaken = await getManager().getRepository(userEntity).findOneById(user.emp_id);

        if(isUsernameTaken){
            res.send({
                message: "username already taken"
            });
        }
        else{
            let savedUser = getManager().getRepository(userEntity).save(user);
            res.send({
                emp_id: (await savedUser).emp_id,
                password: (await savedUser).password,
                message: "Registration Successful"
            });
        }
    }
    catch(error){
        console.log(error);
        res.send({
            message: "an error occurred"
        })
    }
}

export let login = async (req: Request, res: Response) => {

    const hashedPassword = bcrypt.hashSync(req.body.password, 0);
    try{

        let user = await getManager().getRepository(userEntity).findOneById(req.body.emp_id);
    
        if(user) {
            if(bcrypt.compareSync(req.body.password, user.password)){
                req.session.uid = user.emp_id;
                res.send({
                    message: "Login Successful"
                });
            }
            else{
                res.send({
                    message: "wrong password"
                });           
            }
        }
        else{
            res.send({
                message: "wrong username"
            });
        }
    }
    catch(error){
        console.log(error);
        res.send({
            message: "an error occurred",
            error: error
        })
    }
    
}

export let fetchgroups = async (req: Request, res: Response) => {

    let uid = req.session.uid;
    if(uid){
        try{
            var group_ids: number[] = new Array();
            let user_groups = await getManager().getRepository(user_groupsEntity).find();
            user_groups.map((user_group) => {
                if(user_group.emp_id === uid) {
                    group_ids.push(user_group.group_id);
                }
            })
            let user_names = await getManager().getRepository(groupsEntity).findByIds(group_ids);
            res.send(user_names);
        }
        catch(error){
            console.log(error);
            res.send({
                message: "an error occurred"
            })
        }
    }
    else{
        res.send({
            message: "login to fetch groups"
        })
    }
    
}

export let addActivityGroup = async (req: Request, res: Response) => {

    let uid = req.session.uid;
    if(uid){
        try{
            let group: groupsEntity = new groupsEntity();
            group.group_name = req.body.group_name;
            let createdGroup = await getManager().getRepository(groupsEntity).save(group);
            console.log("created group:")
            console.log(createdGroup);
            //console.log(createdGroup.group_name);

            let createdGroupId = createdGroup.group_id;
            let user_group : user_groupsEntity = new user_groupsEntity();
            user_group.group_id = createdGroupId;
            user_group.emp_id = uid;

            let createdUser_group = await getManager().getRepository(user_groupsEntity).save(user_group);
            res.send({
                message: "new group created",
                createdGroupId: createdGroupId,
                createdUser_groupId: createdUser_group.id
            })
        }
        catch(error){
            console.log(error);
            res.send({
                message: "an error occurred"
            })
        }
    }
    else{
        res.send({
            message: "login to add groups"
        })
    }
}

export let addActivity = async (req: Request, res: Response) => {

    let uid = req.session.uid;
    if(uid){
        let group_id = req.body.group_id;
        let query = "select * from user_groups where emp_id='"+uid+"' and group_id="+group_id;
        let user_group_exists = await getManager().query(query);
        let sizeOfuser_group_exists = Object.keys(user_group_exists).length;
        if(sizeOfuser_group_exists>0){
    
            try{
    
                let activity: activitiesEntity = new activitiesEntity();
                activity.group_id = group_id;
                activity.activity_name = req.body.activity_name;
                activity.isCompleted = false;
                
                let savesActivity = await getManager().getRepository(activitiesEntity).save(activity);
                res.send({
                    message: "activity created",
                    activity: savesActivity
                })
            }
            catch(error){
                console.log(error);
                res.send({
                    message: "an error occurred"
                })
            }
        }
        else{
            res.send({
                message: "group doesnot exist"
            })
        }
    }
    else{
        res.send({
            message: "login to add activity"
        })
    }    
}

export let showAllUsers = async (req: Request, res: Response) => {
    let users = await getManager().query(`SELECT * FROM USER`);
    res.send(users)
}

export let fetchActivities = async (req: Request, res: Response) => {

    let uid = req.session.uid;
    if(uid){
        let group_id = req.body.group_id;
        let query1 = "select * from user_groups where emp_id='"+uid+"' and group_id="+group_id;
        let user_group_exists = await getManager().query(query1);
        let sizeOfuser_group_exists = Object.keys(user_group_exists).length;

        if(sizeOfuser_group_exists>0){
    
            try{
                let query2 = "select * from activities where group_id="+group_id;
                let allActivities = await getManager().query(query2)
                res.send({
                    message: "activities fetched",
                    activities: allActivities
                })
            }
            catch(error){
                console.log(error);
                res.send({
                    message: "an error occurred"
                })
            }
        }
        else{
            res.send({
                message: "group doesnot exist"
            })
        }
    }
    else{
        res.send({
            message: "login to add activity"
        })
    }    
}

export let updateActivityStatus = async (req: Request, res: Response) => {

    let uid = req.session.uid;
    if(uid){
        let group_id = req.body.group_id;
        let query = "select * from user_groups where emp_id='"+uid+"' and group_id="+group_id;
        let user_group_exists = await getManager().query(query);
        let sizeOfuser_group_exists = Object.keys(user_group_exists).length;
        if(sizeOfuser_group_exists>0){
    
            try{

                let currentActivity = await getManager().getRepository(activitiesEntity).findOneById(req.body.activity_id);
    
                let activity: activitiesEntity = new activitiesEntity();
                activity.id = currentActivity.id;
                activity.group_id = currentActivity.group_id;
                activity.activity_name = currentActivity.activity_name;
                activity.isCompleted = !currentActivity.isCompleted;
                
                let savedActivity = await getManager().getRepository(activitiesEntity).save(activity);
                res.send({
                    message: "activity updated",
                    activity: savedActivity
                })
            }
            catch(error){
                console.log(error);
                res.send({
                    message: "an error occurred"
                })
            }
        }
        else{
            res.send({
                message: "group doesnot exist"
            })
        }
    }
    else{
        res.send({
            message: "login to add activity"
        })
    }    
}