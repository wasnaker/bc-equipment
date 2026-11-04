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
exports.EquipmentEntity = void 0;
const typeorm_1 = require("typeorm");
const relational_entity_helper_1 = require("../../../../../utils/relational-entity-helper");
const category_entity_1 = require("./category.entity");
const subgroup_entity_1 = require("./subgroup.entity");
const equipment_ulid_generator_1 = require("../../../../utils/equipment-ulid.generator");
let EquipmentEntity = class EquipmentEntity extends relational_entity_helper_1.EntityRelationalHelper {
    assignUlid() {
        if (!this.ulid)
            this.ulid = (0, equipment_ulid_generator_1.generateEquipmentUlid)();
    }
};
exports.EquipmentEntity = EquipmentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", BigInt)
], EquipmentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 26 }),
    __metadata("design:type", String)
], EquipmentEntity.prototype, "ulid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 6, nullable: true }),
    __metadata("design:type", Object)
], EquipmentEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], EquipmentEntity.prototype, "subgroupId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subgroup_entity_1.SubgroupEntity, { onDelete: 'RESTRICT', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'subgroupId' }),
    __metadata("design:type", subgroup_entity_1.SubgroupEntity)
], EquipmentEntity.prototype, "subgroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EquipmentEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.CategoryEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'categoryId' }),
    __metadata("design:type", Object)
], EquipmentEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 190 }),
    __metadata("design:type", String)
], EquipmentEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], EquipmentEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], EquipmentEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EquipmentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EquipmentEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EquipmentEntity.prototype, "assignUlid", null);
exports.EquipmentEntity = EquipmentEntity = __decorate([
    (0, typeorm_1.Index)('UQ_equipment_ulid', ['ulid'], { unique: true }),
    (0, typeorm_1.Index)('UQ_equipment_code', ['code'], { unique: true }),
    (0, typeorm_1.Index)('IDX_equipment_subgroupId', ['subgroupId']),
    (0, typeorm_1.Index)('IDX_equipment_categoryId', ['categoryId']),
    (0, typeorm_1.Entity)({ name: 'equipment' })
], EquipmentEntity);
