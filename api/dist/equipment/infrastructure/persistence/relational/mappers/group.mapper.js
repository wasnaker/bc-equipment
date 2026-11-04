"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMapper = void 0;
const group_1 = require("../../../../domain/group");
const group_entity_1 = require("../entities/group.entity");
class GroupMapper {
    static toDomain(raw) {
        const value = new group_1.Group();
        value.id = raw.id;
        value.name = raw.name;
        value.description = raw.description;
        value.isActive = raw.isActive;
        value.createdAt = raw.createdAt;
        value.updatedAt = raw.updatedAt;
        return value;
    }
    static toPersistence(value) {
        const entity = new group_entity_1.GroupEntity();
        if (value.id && typeof value.id === 'number')
            entity.id = value.id;
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
exports.GroupMapper = GroupMapper;
