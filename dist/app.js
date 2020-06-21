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
const express = require("express");
const bodyParser = require("body-parser");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const appConfig = require("./common/app-config");
const session = require("express-session");
const controller = require("./controllers/appController");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'hello',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 5
    }
}));
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => { });
app.post("/login", controller.login);
app.post("/register", controller.register);
app.post("/fetchgroups", controller.fetchgroups);
app.post("/addActivityGroup", controller.addActivityGroup);
app.post("/addActivity", controller.addActivity);
app.post("/fetchActivities", controller.fetchActivities);
app.post("/updateActivityStatus", controller.updateActivityStatus);
typeorm_1.createConnection(appConfig.configuration).then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connected to database");
}))
    .catch(error => console.log("connection error: ", error));
module.exports = app;
