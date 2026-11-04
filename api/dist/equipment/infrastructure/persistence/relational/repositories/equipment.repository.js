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
exports.EquipmentRelationalRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const equipment_entity_1 = require("../entities/equipment.entity");
const equipment_mapper_1 = require("../mappers/equipment.mapper");
let EquipmentRelationalRepository = class EquipmentRelationalRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(data) {
        const saved = await this.repository.save(this.repository.create(equipment_mapper_1.EquipmentMapper.toPersistence(data)));
        // The database trigger fills code after insert; re-read just like Customer.
        return equipment_mapper_1.EquipmentMapper.toDomain(await this.repository.findOneByOrFail({ id: saved.id }));
    }
    where(filters) {
        const where = {};
        if (filters?.categoryId != null)
            where.categoryId = Number(filters.categoryId);
        if (filters?.isActive !== undefined)
            where.isActive = filters.isActive;
        return where;
    }
    async findManyWithPagination({ filterOptions, sortOptions, paginationOptions }) {
        const where = this.where(filterOptions);
        const search = filterOptions?.search?.trim();
        const rows = await this.repository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: search ? [{ ...where, name: (0, typeorm_2.ILike)(`%${search}%`) }, { ...where, description: (0, typeorm_2.ILike)(`%${search}%`) }, { ...where, code: (0, typeorm_2.ILike)(`%${search}%`) }] : where,
            order: sortOptions?.reduce((acc, sort) => ({ ...acc, [sort.orderBy]: sort.order }), { name: 'ASC' }),
        });
        return rows.map(equipment_mapper_1.EquipmentMapper.toDomain);
    }
    async findById(id) {
        const row = await this.repository.findOne({ where: { id: BigInt(id) } });
        return row ? equipment_mapper_1.EquipmentMapper.toDomain(row) : null;
    }
    async findByCategoryId(categoryId) {
        return (await this.repository.find({ where: { categoryId: Number(categoryId) }, order: { name: 'ASC' } })).map(equipment_mapper_1.EquipmentMapper.toDomain);
    }
    async findByCategoryIdAndName(categoryId, name) {
        const row = await this.repository.createQueryBuilder('equipment')
            .where('"equipment"."categoryId" = :categoryId', { categoryId: Number(categoryId) })
            .andWhere('lower(btrim("equipment"."name")) = lower(btrim(:name))', { name })
            .getOne();
        return row ? equipment_mapper_1.EquipmentMapper.toDomain(row) : null;
    }
    async countWithFilter(filters) {
        const where = this.where(filters);
        const search = filters?.search?.trim();
        return this.repository.count({ where: search ? [{ ...where, name: (0, typeorm_2.ILike)(`%${search}%`) }, { ...where, description: (0, typeorm_2.ILike)(`%${search}%`) }, { ...where, code: (0, typeorm_2.ILike)(`%${search}%`) }] : where });
    }
    countByCategoryId(categoryId) {
        return this.repository.count({ where: { categoryId: Number(categoryId) } });
    }
    async update(id, payload) {
        const current = await this.repository.findOne({ where: { id: BigInt(id) } });
        if (!current)
            return null;
        const update = equipment_mapper_1.EquipmentMapper.toPersistence({ ...equipment_mapper_1.EquipmentMapper.toDomain(current), ...payload });
        delete update.id;
        delete update.ulid;
        delete update.code;
        await this.repository.update({ id: BigInt(id) }, update);
        return equipment_mapper_1.EquipmentMapper.toDomain(await this.repository.findOneByOrFail({ id: BigInt(id) }));
    }
    async remove(id) { await this.repository.delete({ id: BigInt(id) }); }
};
exports.EquipmentRelationalRepository = EquipmentRelationalRepository;
exports.EquipmentRelationalRepository = EquipmentRelationalRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(equipment_entity_1.EquipmentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EquipmentRelationalRepository);
