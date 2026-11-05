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
exports.QueryGroupDto = exports.SortGroupDto = exports.FilterGroupDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class FilterGroupDto {
}
exports.FilterGroupDto = FilterGroupDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'jawa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterGroupDto.prototype, "search", void 0);
class SortGroupDto {
}
exports.SortGroupDto = SortGroupDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], SortGroupDto.prototype, "orderBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['ASC', 'DESC'] }),
    (0, class_transformer_1.Transform)(({ value }) => String(value).toUpperCase()),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], SortGroupDto.prototype, "order", void 0);
class QueryGroupDto {
}
exports.QueryGroupDto = QueryGroupDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === undefined || value === '' ? 1 : Number(value))),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryGroupDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === undefined || value === '' ? 10 : Number(value))),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryGroupDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        try {
            return value ? JSON.parse(value) : undefined;
        }
        catch {
            return undefined;
        }
    }),
    (0, class_transformer_1.Type)(() => FilterGroupDto),
    __metadata("design:type", Object)
], QueryGroupDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        try {
            return value ? JSON.parse(value) : undefined;
        }
        catch {
            return undefined;
        }
    }),
    (0, class_transformer_1.Type)(() => SortGroupDto),
    __metadata("design:type", Object)
], QueryGroupDto.prototype, "sort", void 0);
