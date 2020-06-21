"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_groupsEntity = void 0;
const typeorm_1 = require("typeorm");
let user_groupsEntity = class user_groupsEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("increment"),
    __metadata("design:type", Number)
], user_groupsEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], user_groupsEntity.prototype, "emp_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], user_groupsEntity.prototype, "group_id", void 0);
user_groupsEntity = __decorate([
    typeorm_1.Entity("user_groups")
], user_groupsEntity);
exports.user_groupsEntity = user_groupsEntity;
