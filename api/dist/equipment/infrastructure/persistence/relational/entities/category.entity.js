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
exports.CategoryEntity = void 0;
const typeorm_1 = require("typeorm");
const relational_entity_helper_1 = require("../../../../../utils/relational-entity-helper");
const subgroup_entity_1 = require("./subgroup.entity");
let CategoryEntity = class CategoryEntity extends relational_entity_helper_1.EntityRelationalHelper {
};
exports.CategoryEntity = CategoryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CategoryEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: Number }),
    __metadata("design:type", Number)
], CategoryEntity.prototype, "subgroupId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subgroup_entity_1.SubgroupEntity, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'subgroupId' }),
    __metadata("design:type", subgroup_entity_1.SubgroupEntity)
], CategoryEntity.prototype, "subgroup", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: String, length: 190 }),
    __metadata("design:type", String)
], CategoryEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, length: 500, nullable: true }),
    __metadata("design:type", Object)
], CategoryEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], CategoryEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CategoryEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CategoryEntity.prototype, "updatedAt", void 0);
exports.CategoryEntity = CategoryEntity = __decorate([
    (0, typeorm_1.Index)('UQ_equipment_category_subgroup_name', ['subgroupId', 'name'], { unique: true }),
    (0, typeorm_1.Entity)({ name: 'equipment_category' })
], CategoryEntity);
