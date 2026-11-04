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
exports.GroupsRelationalRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const group_entity_1 = require("../entities/group.entity");
const group_mapper_1 = require("../mappers/group.mapper");
let GroupsRelationalRepository = class GroupsRelationalRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(data) {
        return group_mapper_1.GroupMapper.toDomain(await this.repository.save(this.repository.create(group_mapper_1.GroupMapper.toPersistence(data))));
    }
    async findManyWithPagination({ filterOptions, sortOptions, paginationOptions }) {
        const search = filterOptions?.search?.trim();
        const where = search ? [{ name: (0, typeorm_2.ILike)(`%${search}%`) }, { description: (0, typeorm_2.ILike)(`%${search}%`) }] : [{}];
        const rows = await this.repository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where,
            order: sortOptions?.reduce((acc, sort) => ({ ...acc, [sort.orderBy]: sort.order }), { name: 'ASC' }),
        });
        return rows.map(group_mapper_1.GroupMapper.toDomain);
    }
    async findAll() {
        return (await this.repository.find({ order: { name: 'ASC' } })).map(group_mapper_1.GroupMapper.toDomain);
    }
    async findById(id) {
        const row = await this.repository.findOne({ where: { id: Number(id) } });
        return row ? group_mapper_1.GroupMapper.toDomain(row) : null;
    }
    async findByName(name) {
        const row = await this.repository.findOne({ where: { name } });
        return row ? group_mapper_1.GroupMapper.toDomain(row) : null;
    }
    async countAll() { return this.repository.count(); }
    async countWithFilter(filterOptions) {
        const search = filterOptions?.search?.trim();
        if (!search)
            return this.repository.count();
        return this.repository.count({ where: [{ name: (0, typeorm_2.ILike)(`%${search}%`) }, { description: (0, typeorm_2.ILike)(`%${search}%`) }] });
    }
    async update(id, payload) {
        const row = await this.repository.findOne({ where: { id: Number(id) } });
        if (!row)
            return null;
        return group_mapper_1.GroupMapper.toDomain(await this.repository.save(this.repository.create(group_mapper_1.GroupMapper.toPersistence({ ...group_mapper_1.GroupMapper.toDomain(row), ...payload }))));
    }
    async remove(id) { await this.repository.delete(Number(id)); }
};
exports.GroupsRelationalRepository = GroupsRelationalRepository;
exports.GroupsRelationalRepository = GroupsRelationalRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(group_entity_1.GroupEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GroupsRelationalRepository);
