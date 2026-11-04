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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const create_group_dto_1 = require("../dto/create-group.dto");
const update_group_dto_1 = require("../dto/update-group.dto");
const query_group_dto_1 = require("../dto/query-group.dto");
const create_subgroup_dto_1 = require("../dto/create-subgroup.dto");
const update_subgroup_dto_1 = require("../dto/update-subgroup.dto");
const query_subgroup_dto_1 = require("../dto/query-subgroup.dto");
const group_1 = require("../domain/group");
const subgroup_1 = require("../domain/subgroup");
const category_1 = require("../domain/category");
const create_category_dto_1 = require("../dto/create-category.dto");
const update_category_dto_1 = require("../dto/update-category.dto");
const query_category_dto_1 = require("../dto/query-category.dto");
const equipment_service_1 = require("../services/equipment.service");
const equipment_access_guard_1 = require("../security/equipment-access.guard");
const infinity_pagination_response_dto_1 = require("../../utils/dto/infinity-pagination-response.dto");
const infinity_pagination_1 = require("../../utils/infinity-pagination");
let EquipmentController = class EquipmentController {
    constructor(service) {
        this.service = service;
    }
    createGroup(dto) {
        return this.service.createGroup(dto);
    }
    async findGroups(query) {
        const page = query.page ?? 1;
        const limit = Math.min(query.limit ?? 10, 50);
        const data = await this.service.findManyGroupsWithPagination({
            filterOptions: query.filters ?? null,
            sortOptions: query.sort ?? null,
            paginationOptions: { page, limit },
        });
        const total = await this.service.countGroups(query.filters ?? null);
        return (0, infinity_pagination_1.infinityPagination)(data, { page, limit }, total);
    }
    findGroup(id) {
        return this.service.findGroupById(id);
    }
    updateGroup(id, dto) {
        return this.service.updateGroup(id, dto);
    }
    removeGroup(id) {
        return this.service.removeGroup(id);
    }
    createSubgroup(dto) {
        return this.service.createSubgroup(dto);
    }
    async findSubgroups(query) {
        const page = query.page ?? 1;
        const limit = Math.min(query.limit ?? 10, 50);
        const filters = { ...(query.filters ?? {}) };
        if (query.groupId !== undefined)
            filters.groupId = query.groupId;
        const data = await this.service.findManySubgroupsWithPagination({
            filterOptions: filters,
            sortOptions: query.sort ?? null,
            paginationOptions: { page, limit },
        });
        const total = await this.service.countSubgroups(filters);
        return (0, infinity_pagination_1.infinityPagination)(data, { page, limit }, total);
    }
    findSubgroup(id) {
        return this.service.findSubgroupById(id);
    }
    updateSubgroup(id, dto) {
        return this.service.updateSubgroup(id, dto);
    }
    removeSubgroup(id) {
        return this.service.removeSubgroup(id);
    }
    createCategory(dto) {
        return this.service.createCategory(dto);
    }
    async findCategories(query) {
        const page = query.page ?? 1;
        const limit = Math.min(query.limit ?? 10, 50);
        const filters = { ...(query.filters ?? {}) };
        if (query.subgroupId !== undefined)
            filters.subgroupId = query.subgroupId;
        const data = await this.service.findManyCategoriesWithPagination({
            filterOptions: filters,
            sortOptions: query.sort ?? null,
            paginationOptions: { page, limit },
        });
        const total = await this.service.countCategories(filters);
        return (0, infinity_pagination_1.infinityPagination)(data, { page, limit }, total);
    }
    findCategory(id) {
        return this.service.findCategoryById(id);
    }
    updateCategory(id, dto) {
        return this.service.updateCategory(id, dto);
    }
    removeCategory(id) {
        return this.service.removeCategory(id);
    }
};
exports.EquipmentController = EquipmentController;
__decorate([
    (0, common_1.Post)('groups'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiCreatedResponse)({ type: group_1.Group }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_group_dto_1.CreateGroupDto]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)('groups'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: (0, infinity_pagination_response_dto_1.InfinityPaginationResponse)(group_1.Group) }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_group_dto_1.QueryGroupDto]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "findGroups", null);
__decorate([
    (0, common_1.Get)('groups/:id'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: group_1.Group }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, required: true }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "findGroup", null);
__decorate([
    (0, common_1.Patch)('groups/:id'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: group_1.Group }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, required: true }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_group_dto_1.UpdateGroupDto]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "updateGroup", null);
__decorate([
    (0, common_1.Delete)('groups/:id'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, required: true }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "removeGroup", null);
__decorate([
    (0, common_1.Post)('subgroups'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiCreatedResponse)({ type: subgroup_1.Subgroup }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subgroup_dto_1.CreateSubgroupDto]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "createSubgroup", null);
__decorate([
    (0, common_1.Get)('subgroups'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: (0, infinity_pagination_response_dto_1.InfinityPaginationResponse)(subgroup_1.Subgroup) }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_subgroup_dto_1.QuerySubgroupDto]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "findSubgroups", null);
__decorate([
    (0, common_1.Get)('subgroups/:id'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: subgroup_1.Subgroup }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, required: true }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "findSubgroup", null);
__decorate([
    (0, common_1.Patch)('subgroups/:id'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: subgroup_1.Subgroup }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, required: true }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_subgroup_dto_1.UpdateSubgroupDto]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "updateSubgroup", null);
__decorate([
    (0, common_1.Delete)('subgroups/:id'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, required: true }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "removeSubgroup", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiCreatedResponse)({ type: category_1.Category }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: (0, infinity_pagination_response_dto_1.InfinityPaginationResponse)(category_1.Category) }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_category_dto_1.QueryCategoryDto]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "findCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: category_1.Category }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, required: true }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "findCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: category_1.Category }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, required: true }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, common_1.UseGuards)(equipment_access_guard_1.EquipmentAccessGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, required: true }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EquipmentController.prototype, "removeCategory", null);
exports.EquipmentController = EquipmentController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiTags)('Equipment'),
    (0, common_1.Controller)({ path: 'equipment', version: '1' }),
    __metadata("design:paramtypes", [equipment_service_1.EquipmentService])
], EquipmentController);
