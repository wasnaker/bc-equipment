"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentMapper = void 0;
const equipment_1 = require("../../../../domain/equipment");
const equipment_entity_1 = require("../entities/equipment.entity");
class EquipmentMapper {
    static toDomain(raw) {
        const value = new equipment_1.Equipment();
        value.id = raw.id.toString();
        value.ulid = raw.ulid;
        value.code = raw.code ?? '';
        value.categoryId = raw.categoryId;
        value.name = raw.name;
        value.description = raw.description;
        value.isActive = raw.isActive;
        value.createdAt = raw.createdAt;
        value.updatedAt = raw.updatedAt;
        return value;
    }
    static toPersistence(value) {
        const entity = new equipment_entity_1.EquipmentEntity();
        if (value.id !== undefined)
            entity.id = BigInt(value.id);
        if (value.ulid !== undefined)
            entity.ulid = value.ulid;
        if (value.categoryId !== undefined)
            entity.categoryId = Number(value.categoryId);
        if (value.name !== undefined)
            entity.name = value.name;
        if (value.description !== undefined)
            entity.description = value.description ?? null;
        if (value.isActive !== undefined)
            entity.isActive = value.isActive;
        return entity;
    }
}
exports.EquipmentMapper = EquipmentMapper;
