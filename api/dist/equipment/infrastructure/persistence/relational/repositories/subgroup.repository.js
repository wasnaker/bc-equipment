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
exports.SubgroupsRelationalRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subgroup_entity_1 = require("../entities/subgroup.entity");
const subgroup_mapper_1 = require("../mappers/subgroup.mapper");
let SubgroupsRelationalRepository = class SubgroupsRelationalRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(data) {
        return subgroup_mapper_1.SubgroupMapper.toDomain(await this.repository.save(this.repository.create(subgroup_mapper_1.SubgroupMapper.toPersistence(data))));
    }
    buildWhere(filters) {
        const where = {};
        if (filters?.groupId != null)
            where.groupId = Number(filters.groupId);
        return where;
    }
    async findManyWithPagination({ filterOptions, sortOptions, paginationOptions }) {
        const where = this.buildWhere(filterOptions);
        const search = filterOptions?.search?.trim();
        const rows = await this.repository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: search ? [{ ...where, name: (0, typeorm_2.ILike)(`%${search}%`) }, { ...where, description: (0, typeorm_2.ILike)(`%${search}%`) }] : where,
            order: sortOptions?.reduce((acc, sort) => ({ ...acc, [sort.orderBy]: sort.order }), { name: 'ASC' }),
        });
        return rows.map(subgroup_mapper_1.SubgroupMapper.toDomain);
    }
    async findAll() {
        return (await this.repository.find({ order: { name: 'ASC' } })).map(subgroup_mapper_1.SubgroupMapper.toDomain);
    }
    async findById(id) {
        const row = await this.repository.findOne({ where: { id: Number(id) } });
        return row ? subgroup_mapper_1.SubgroupMapper.toDomain(row) : null;
    }
    async findByGroupId(groupId) {
        return (await this.repository.find({ where: { groupId: Number(groupId) }, order: { name: 'ASC' } })).map(subgroup_mapper_1.SubgroupMapper.toDomain);
    }
    async findByGroupIdAndName(groupId, name) {
        const row = await this.repository.findOne({ where: { groupId: Number(groupId), name } });
        return row ? subgroup_mapper_1.SubgroupMapper.toDomain(row) : null;
    }
    async countByGroupId(groupId) {
        return this.repository.count({ where: { groupId: Number(groupId) } });
    }
    async countAll() { return this.repository.count(); }
    async countWithFilter(filters) {
        const where = this.buildWhere(filters);
        const search = filters?.search?.trim();
        return this.repository.count({ where: search ? [{ ...where, name: (0, typeorm_2.ILike)(`%${search}%`) }, { ...where, description: (0, typeorm_2.ILike)(`%${search}%`) }] : where });
    }
    async update(id, payload) {
        const row = await this.repository.findOne({ where: { id: Number(id) } });
        if (!row)
            return null;
        return subgroup_mapper_1.SubgroupMapper.toDomain(await this.repository.save(this.repository.create(subgroup_mapper_1.SubgroupMapper.toPersistence({ ...subgroup_mapper_1.SubgroupMapper.toDomain(row), ...payload }))));
    }
    async remove(id) { await this.repository.delete(Number(id)); }
    async removeByGroupId(groupId) { await this.repository.delete({ groupId: Number(groupId) }); }
};
exports.SubgroupsRelationalRepository = SubgroupsRelationalRepository;
exports.SubgroupsRelationalRepository = SubgroupsRelationalRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subgroup_entity_1.SubgroupEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubgroupsRelationalRepository);
