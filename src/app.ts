import * as express from 'express';
import * as bodyParser from "body-parser";
import "reflect-metadata";
import {createConnection} from "typeorm";
import * as appConfig from "./common/app-config";
import * as session from "express-session"
import * as controller from "./controllers/appController";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'hello',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*5
    }
  }));

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {});

app.post("/login",controller.login );
app.post("/register", controller.register);
app.post("/fetchgroups",controller.fetchgroups );
app.post("/addActivityGroup", controller.addActivityGroup);
app.post("/addActivity", controller.addActivity);
app.post("/fetchActivities", controller.fetchActivities);
app.post("/updateActivityStatus",controller.updateActivityStatus );

createConnection(appConfig.configuration).then(async connection => {
    console.log("Connected to database");

})
.catch(error => console.log("connection error: ", error));

module.exports = app;