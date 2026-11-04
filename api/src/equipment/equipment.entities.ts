import { GroupEntity } from './infrastructure/persistence/relational/entities/group.entity';
import { SubgroupEntity } from './infrastructure/persistence/relational/entities/subgroup.entity';
import { CategoryEntity } from './infrastructure/persistence/relational/entities/category.entity';
import { EquipmentEntity } from './infrastructure/persistence/relational/entities/equipment.entity';

export const EQUIPMENT_ENTITIES = [GroupEntity, SubgroupEntity, CategoryEntity, EquipmentEntity] as const;
export const moduleEntities = EQUIPMENT_ENTITIES;
export { GroupEntity, SubgroupEntity, CategoryEntity, EquipmentEntity };
