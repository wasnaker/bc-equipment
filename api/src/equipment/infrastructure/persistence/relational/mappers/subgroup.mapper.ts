import { Subgroup } from '../../../../domain/subgroup';
import { SubgroupEntity } from '../entities/subgroup.entity';

export class SubgroupMapper {
  static toDomain(raw: SubgroupEntity): Subgroup {
    const value = new Subgroup();
    value.id = raw.id;
    value.groupId = raw.groupId;
    value.name = raw.name;
    value.description = raw.description;
    value.isActive = raw.isActive;
    value.createdAt = raw.createdAt;
    value.updatedAt = raw.updatedAt;
    return value;
  }

  static toPersistence(value: Partial<Subgroup>): SubgroupEntity {
    const entity = new SubgroupEntity();
    if (value.id && typeof value.id === 'number') entity.id = value.id;
    if (value.groupId !== undefined) entity.groupId = Number(value.groupId);
    if (value.name !== undefined) entity.name = value.name;
    if (value.description !== undefined) entity.description = value.description ?? null;
    if (value.isActive !== undefined) entity.isActive = value.isActive;
    if (value.createdAt !== undefined) entity.createdAt = value.createdAt;
    if (value.updatedAt !== undefined) entity.updatedAt = value.updatedAt;
    return entity;
  }
}
