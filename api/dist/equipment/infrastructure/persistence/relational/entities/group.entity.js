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
exports.GroupEntity = void 0;
const typeorm_1 = require("typeorm");
const relational_entity_helper_1 = require("../../../../../utils/relational-entity-helper");
let GroupEntity = class GroupEntity extends relational_entity_helper_1.EntityRelationalHelper {
};
exports.GroupEntity = GroupEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GroupEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, length: 190 }),
    __metadata("design:type", String)
], GroupEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, length: 30, nullable: true }),
    __metadata("design:type", Object)
], GroupEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, length: 20, nullable: true }),
    __metadata("design:type", Object)
], GroupEntity.prototype, "abbr", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, length: 500, nullable: true }),
    __metadata("design:type", Object)
], GroupEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], GroupEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GroupEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GroupEntity.prototype, "updatedAt", void 0);
exports.GroupEntity = GroupEntity = __decorate([
    (0, typeorm_1.Index)('UQ_equipment_group_name', ['name'], { unique: true }),
    (0, typeorm_1.Index)('UQ_equipment_group_code', ['code'], { unique: true, where: '"code" IS NOT NULL' }),
    (0, typeorm_1.Entity)({ name: 'equipment_group' })
], GroupEntity);
