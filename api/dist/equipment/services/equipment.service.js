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
exports.EquipmentService = void 0;
const common_1 = require("@nestjs/common");
const equipment_repository_1 = require("../infrastructure/persistence/equipment.repository");
const group_repository_1 = require("../infrastructure/persistence/group.repository");
const subgroup_repository_1 = require("../infrastructure/persistence/subgroup.repository");
const category_repository_1 = require("../infrastructure/persistence/category.repository");
let EquipmentService = class EquipmentService {
    constructor(groupRepository, subgroupRepository, categoryRepository, equipmentRepository) {
        this.groupRepository = groupRepository;
        this.subgroupRepository = subgroupRepository;
        this.categoryRepository = categoryRepository;
        this.equipmentRepository = equipmentRepository;
    }
    async createGroup(dto) {
        if (await this.groupRepository.findByName(dto.name)) {
            throw new common_1.UnprocessableEntityException({ status: common_1.HttpStatus.UNPROCESSABLE_ENTITY, errors: { name: 'groupNameAlreadyExists' } });
        }
        return this.groupRepository.create({
            name: dto.name.trim(),
            description: dto.description?.trim() || null,
            isActive: dto.isActive ?? true,
        });
    }
    async findManyGroupsWithPagination(args) {
        return this.groupRepository.findManyWithPagination(args);
    }
    findGroupById(id) {
        return this.groupRepository.findById(id);
    }
    async updateGroup(id, dto) {
        const current = await this.groupRepository.findById(id);
        if (!current)
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
        if (dto.name?.trim()) {
            const duplicate = await this.groupRepository.findByName(dto.name.trim());
            if (duplicate && Number(duplicate.id) !== Number(id))
                throw new common_1.UnprocessableEntityException({ status: 422, errors: { name: 'groupNameAlreadyExists' } });
        }
        const updated = await this.groupRepository.update(id, { ...dto, name: dto.name?.trim() });
        if (!updated)
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
        return updated;
    }
    async removeGroup(id) {
        if (!(await this.groupRepository.findById(id)))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
        await this.groupRepository.remove(id);
    }
    countGroups(filters) {
        return this.groupRepository.countWithFilter(filters);
    }
    async createSubgroup(dto) {
        if (!(await this.groupRepository.findById(dto.groupId)))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
        if (await this.subgroupRepository.findByGroupIdAndName(dto.groupId, dto.name.trim()))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { name: 'subgroupNameAlreadyExists' } });
        return this.subgroupRepository.create({
            groupId: dto.groupId,
            name: dto.name.trim(),
            description: dto.description?.trim() || null,
            isActive: dto.isActive ?? true,
        });
    }
    findManySubgroupsWithPagination(args) {
        return this.subgroupRepository.findManyWithPagination(args);
    }
    findSubgroupById(id) {
        return this.subgroupRepository.findById(id);
    }
    async updateSubgroup(id, dto) {
        const current = await this.subgroupRepository.findById(id);
        if (!current)
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
        const targetGroupId = dto.groupId ?? current.groupId;
        if (dto.groupId !== undefined && !(await this.groupRepository.findById(dto.groupId)))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
        const targetName = dto.name?.trim() ?? current.name;
        const duplicate = await this.subgroupRepository.findByGroupIdAndName(targetGroupId, targetName);
        if (duplicate && Number(duplicate.id) !== Number(id))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { name: 'subgroupNameAlreadyExists' } });
        const updated = await this.subgroupRepository.update(id, { ...dto, name: dto.name?.trim() });
        if (!updated)
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
        return updated;
    }
    async removeSubgroup(id) {
        if (!(await this.subgroupRepository.findById(id)))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
        await this.subgroupRepository.remove(id);
    }
    countSubgroups(filters) {
        return this.subgroupRepository.countWithFilter(filters);
    }
    countSubgroupsByGroupId(groupId) {
        return this.subgroupRepository.countByGroupId(groupId);
    }
    async createCategory(dto) {
        if (!(await this.subgroupRepository.findById(dto.subgroupId)))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
        if (await this.categoryRepository.findBySubgroupIdAndName(dto.subgroupId, dto.name.trim()))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { name: 'categoryNameAlreadyExists' } });
        return this.categoryRepository.create({
            subgroupId: dto.subgroupId,
            name: dto.name.trim(),
            description: dto.description?.trim() || null,
            isActive: dto.isActive ?? true,
        });
    }
    findManyCategoriesWithPagination(args) {
        return this.categoryRepository.findManyWithPagination(args);
    }
    findCategoryById(id) {
        return this.categoryRepository.findById(id);
    }
    async updateCategory(id, dto) {
        const current = await this.categoryRepository.findById(id);
        if (!current)
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { category: 'categoryNotExists' } });
        const targetSubgroupId = dto.subgroupId ?? current.subgroupId;
        if (dto.subgroupId !== undefined && !(await this.subgroupRepository.findById(dto.subgroupId)))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
        const targetName = dto.name?.trim() ?? current.name;
        const duplicate = await this.categoryRepository.findBySubgroupIdAndName(targetSubgroupId, targetName);
        if (duplicate && Number(duplicate.id) !== Number(id))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { name: 'categoryNameAlreadyExists' } });
        const updated = await this.categoryRepository.update(id, { ...dto, name: dto.name?.trim() });
        if (!updated)
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { category: 'categoryNotExists' } });
        return updated;
    }
    async removeCategory(id) {
        if (!(await this.categoryRepository.findById(id)))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { category: 'categoryNotExists' } });
        await this.categoryRepository.remove(id);
    }
    countCategories(filters) {
        return this.categoryRepository.countWithFilter(filters);
    }
    countCategoriesBySubgroupId(subgroupId) {
        return this.categoryRepository.countBySubgroupId(subgroupId);
    }
    async createEquipment(dto) {
        if (!(await this.subgroupRepository.findById(dto.subgroupId))) {
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
        }
        const categoryId = dto.categoryId ?? null;
        if (categoryId !== null) {
            const category = await this.categoryRepository.findById(categoryId);
            if (!category)
                throw new common_1.UnprocessableEntityException({ status: 422, errors: { category: 'categoryNotExists' } });
            if (Number(category.subgroupId) !== Number(dto.subgroupId)) {
                throw new common_1.UnprocessableEntityException({ status: 422, errors: { category: 'categorySubgroupMismatch' } });
            }
        }
        const name = dto.name.trim();
        if (await this.equipmentRepository.findBySubgroupIdCategoryIdAndName(dto.subgroupId, categoryId, name)) {
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { name: 'equipmentNameAlreadyExists' } });
        }
        return this.equipmentRepository.create({
            subgroupId: dto.subgroupId,
            categoryId,
            name,
            description: dto.description?.trim() || null,
            isActive: dto.isActive ?? true,
        });
    }
    findManyEquipmentWithPagination(args) {
        return this.equipmentRepository.findManyWithPagination(args);
    }
    findEquipmentById(id) { return this.equipmentRepository.findById(id); }
    async updateEquipment(id, dto) {
        const current = await this.equipmentRepository.findById(id);
        if (!current)
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { equipment: 'equipmentNotExists' } });
        const subgroupId = dto.subgroupId ?? Number(current.subgroupId);
        if (dto.subgroupId !== undefined && !(await this.subgroupRepository.findById(subgroupId))) {
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
        }
        const categoryId = dto.categoryId !== undefined ? dto.categoryId : current.categoryId;
        if (categoryId !== null) {
            const category = await this.categoryRepository.findById(categoryId);
            if (!category)
                throw new common_1.UnprocessableEntityException({ status: 422, errors: { category: 'categoryNotExists' } });
            if (Number(category.subgroupId) !== Number(subgroupId)) {
                throw new common_1.UnprocessableEntityException({ status: 422, errors: { category: 'categorySubgroupMismatch' } });
            }
        }
        const name = dto.name?.trim() ?? current.name;
        const duplicate = await this.equipmentRepository.findBySubgroupIdCategoryIdAndName(subgroupId, categoryId, name);
        if (duplicate && String(duplicate.id) !== String(id)) {
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { name: 'equipmentNameAlreadyExists' } });
        }
        const updated = await this.equipmentRepository.update(id, { ...dto, subgroupId, categoryId, name });
        if (!updated)
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { equipment: 'equipmentNotExists' } });
        return updated;
    }
    async removeEquipment(id) {
        if (!(await this.equipmentRepository.findById(id)))
            throw new common_1.UnprocessableEntityException({ status: 422, errors: { equipment: 'equipmentNotExists' } });
        await this.equipmentRepository.remove(id);
    }
    countEquipment(filters) { return this.equipmentRepository.countWithFilter(filters); }
    countEquipmentByCategoryId(categoryId) { return this.equipmentRepository.countByCategoryId(categoryId); }
};
exports.EquipmentService = EquipmentService;
exports.EquipmentService = EquipmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [group_repository_1.GroupRepository,
        subgroup_repository_1.SubgroupRepository,
        category_repository_1.CategoryRepository,
        equipment_repository_1.EquipmentRepository])
], EquipmentService);
