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
exports.QueryEquipmentDto = exports.SortEquipmentDto = exports.FilterEquipmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class FilterEquipmentDto {
}
exports.FilterEquipmentDto = FilterEquipmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ name: 'subgroup_id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value, obj }) => Number(value ?? obj?.subgroup_id)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterEquipmentDto.prototype, "subgroupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ name: 'category_id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value, obj }) => Number(value ?? obj?.category_id)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterEquipmentDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterEquipmentDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === true || value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterEquipmentDto.prototype, "isActive", void 0);
class SortEquipmentDto {
}
exports.SortEquipmentDto = SortEquipmentDto;
__decorate([
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SortEquipmentDto.prototype, "orderBy", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => String(value).toUpperCase()),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], SortEquipmentDto.prototype, "order", void 0);
class QueryEquipmentDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.QueryEquipmentDto = QueryEquipmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ name: 'subgroup_id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value, obj }) => Number(value ?? obj?.subgroup_id)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryEquipmentDto.prototype, "subgroupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === undefined ? 1 : Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], QueryEquipmentDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 10, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === undefined ? 10 : Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Object)
], QueryEquipmentDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ name: 'category_id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value, obj }) => Number(value ?? obj?.category_id)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryEquipmentDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => { try {
        return value ? JSON.parse(value) : undefined;
    }
    catch {
        return undefined;
    } }),
    __metadata("design:type", FilterEquipmentDto)
], QueryEquipmentDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => { try {
        return value ? JSON.parse(value) : undefined;
    }
    catch {
        return undefined;
    } }),
    __metadata("design:type", Array)
], QueryEquipmentDto.prototype, "sort", void 0);
