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
exports.CategoriesRelationalRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
const category_mapper_1 = require("../mappers/category.mapper");
let CategoriesRelationalRepository = class CategoriesRelationalRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(data) {
        return category_mapper_1.CategoryMapper.toDomain(await this.repository.save(this.repository.create(category_mapper_1.CategoryMapper.toPersistence(data))));
    }
    buildWhere(filters) {
        const where = {};
        if (filters?.subgroupId != null)
            where.subgroupId = Number(filters.subgroupId);
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
        return rows.map(category_mapper_1.CategoryMapper.toDomain);
    }
    async findAll() {
        return (await this.repository.find({ order: { name: 'ASC' } })).map(category_mapper_1.CategoryMapper.toDomain);
    }
    async findById(id) {
        const row = await this.repository.findOne({ where: { id: Number(id) } });
        return row ? category_mapper_1.CategoryMapper.toDomain(row) : null;
    }
    async findBySubgroupId(subgroupId) {
        return (await this.repository.find({ where: { subgroupId: Number(subgroupId) }, order: { name: 'ASC' } })).map(category_mapper_1.CategoryMapper.toDomain);
    }
    async findBySubgroupIdAndName(subgroupId, name) {
        const row = await this.repository.findOne({ where: { subgroupId: Number(subgroupId), name } });
        return row ? category_mapper_1.CategoryMapper.toDomain(row) : null;
    }
    async countBySubgroupId(subgroupId) {
        return this.repository.count({ where: { subgroupId: Number(subgroupId) } });
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
        return category_mapper_1.CategoryMapper.toDomain(await this.repository.save(this.repository.create(category_mapper_1.CategoryMapper.toPersistence({ ...category_mapper_1.CategoryMapper.toDomain(row), ...payload }))));
    }
    async remove(id) { await this.repository.delete(Number(id)); }
    async removeBySubgroupId(subgroupId) { await this.repository.delete({ subgroupId: Number(subgroupId) }); }
};
exports.CategoriesRelationalRepository = CategoriesRelationalRepository;
exports.CategoriesRelationalRepository = CategoriesRelationalRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesRelationalRepository);
