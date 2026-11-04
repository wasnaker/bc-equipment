import { Equipment } from '../../../../domain/equipment';
import { EquipmentEntity } from '../entities/equipment.entity';

export class EquipmentMapper {
  static toDomain(raw: EquipmentEntity): Equipment {
    const value = new Equipment();
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

  static toPersistence(value: Partial<Equipment>): EquipmentEntity {
    const entity = new EquipmentEntity();
    if (value.id !== undefined) entity.id = BigInt(value.id);
    if (value.ulid !== undefined) entity.ulid = value.ulid;
    if (value.categoryId !== undefined) entity.categoryId = Number(value.categoryId);
    if (value.name !== undefined) entity.name = value.name;
    if (value.description !== undefined) entity.description = value.description ?? null;
    if (value.isActive !== undefined) entity.isActive = value.isActive;
    return entity;
  }
}
