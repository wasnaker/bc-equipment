import { Category } from '../../../../domain/category';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryMapper {
  static toDomain(raw: CategoryEntity): Category {
    const value = new Category();
    value.id = raw.id;
    value.subgroupId = raw.subgroupId;
    value.name = raw.name;
    value.description = raw.description;
    value.isActive = raw.isActive;
    value.createdAt = raw.createdAt;
    value.updatedAt = raw.updatedAt;
    return value;
  }

  static toPersistence(value: Partial<Category>): CategoryEntity {
    const entity = new CategoryEntity();
    if (value.id && typeof value.id === 'number') entity.id = value.id;
    if (value.subgroupId !== undefined) entity.subgroupId = Number(value.subgroupId);
    if (value.name !== undefined) entity.name = value.name;
    if (value.description !== undefined) entity.description = value.description ?? null;
    if (value.isActive !== undefined) entity.isActive = value.isActive;
    if (value.createdAt !== undefined) entity.createdAt = value.createdAt;
    if (value.updatedAt !== undefined) entity.updatedAt = value.updatedAt;
    return entity;
  }
}
