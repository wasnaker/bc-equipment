import { Group } from '../../../../domain/group';
import { GroupEntity } from '../entities/group.entity';

export class GroupMapper {
  static toDomain(raw: GroupEntity): Group {
    const value = new Group();
    value.id = raw.id;
    value.name = raw.name;
    value.description = raw.description;
    value.isActive = raw.isActive;
    value.createdAt = raw.createdAt;
    value.updatedAt = raw.updatedAt;
    return value;
  }

  static toPersistence(value: Partial<Group>): GroupEntity {
    const entity = new GroupEntity();
    if (value.id && typeof value.id === 'number') entity.id = value.id;
    if (value.name !== undefined) entity.name = value.name;
    if (value.description !== undefined) entity.description = value.description ?? null;
    if (value.isActive !== undefined) entity.isActive = value.isActive;
    if (value.createdAt !== undefined) entity.createdAt = value.createdAt;
    if (value.updatedAt !== undefined) entity.updatedAt = value.updatedAt;
    return entity;
  }
}
