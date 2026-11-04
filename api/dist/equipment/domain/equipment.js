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
exports.Equipment = void 0;
const swagger_1 = require("@nestjs/swagger");
class Equipment {
}
exports.Equipment = Equipment;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345' }),
    __metadata("design:type", Object)
], Equipment.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '01JQZ8M6K7P2X4R9T5V3W1Y0AB' }),
    __metadata("design:type", String)
], Equipment.prototype, "ulid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '00AB12' }),
    __metadata("design:type", String)
], Equipment.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Object)
], Equipment.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Excavator' }),
    __metadata("design:type", String)
], Equipment.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Crawler excavator type', nullable: true }),
    __metadata("design:type", Object)
], Equipment.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], Equipment.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], Equipment.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], Equipment.prototype, "updatedAt", void 0);
