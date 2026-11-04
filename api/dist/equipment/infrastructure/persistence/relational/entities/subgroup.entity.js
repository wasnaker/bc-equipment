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
exports.SubgroupEntity = void 0;
const typeorm_1 = require("typeorm");
const relational_entity_helper_1 = require("../../../../../utils/relational-entity-helper");
const group_entity_1 = require("./group.entity");
let SubgroupEntity = class SubgroupEntity extends relational_entity_helper_1.EntityRelationalHelper {
};
exports.SubgroupEntity = SubgroupEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SubgroupEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: Number }),
    __metadata("design:type", Number)
], SubgroupEntity.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => group_entity_1.GroupEntity, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'groupId' }),
    __metadata("design:type", group_entity_1.GroupEntity)
], SubgroupEntity.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: String, length: 190 }),
    __metadata("design:type", String)
], SubgroupEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, length: 500, nullable: true }),
    __metadata("design:type", Object)
], SubgroupEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], SubgroupEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SubgroupEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SubgroupEntity.prototype, "updatedAt", void 0);
exports.SubgroupEntity = SubgroupEntity = __decorate([
    (0, typeorm_1.Index)('UQ_equipment_subgroup_group_name', ['groupId', 'name'], { unique: true }),
    (0, typeorm_1.Entity)({ name: 'equipment_subgroup' })
], SubgroupEntity);
