"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubgroupMapper = void 0;
const subgroup_1 = require("../../../../domain/subgroup");
const subgroup_entity_1 = require("../entities/subgroup.entity");
class SubgroupMapper {
    static toDomain(raw) {
        const value = new subgroup_1.Subgroup();
        value.id = raw.id;
        value.groupId = raw.groupId;
        value.name = raw.name;
        value.description = raw.description;
        value.isActive = raw.isActive;
        value.createdAt = raw.createdAt;
        value.updatedAt = raw.updatedAt;
        return value;
    }
    static toPersistence(value) {
        const entity = new subgroup_entity_1.SubgroupEntity();
        if (value.id && typeof value.id === 'number')
            entity.id = value.id;
        if (value.groupId !== undefined)
            entity.groupId = Number(value.groupId);
        if (value.name !== undefined)
            entity.name = value.name;
        if (value.description !== undefined)
            entity.description = value.description ?? null;
        if (value.isActive !== undefined)
            entity.isActive = value.isActive;
        if (value.createdAt !== undefined)
            entity.createdAt = value.createdAt;
        if (value.updatedAt !== undefined)
            entity.updatedAt = value.updatedAt;
        return entity;
    }
}
exports.SubgroupMapper = SubgroupMapper;
