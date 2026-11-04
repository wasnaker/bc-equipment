import { GroupEntity } from './infrastructure/persistence/relational/entities/group.entity';
import { SubgroupEntity } from './infrastructure/persistence/relational/entities/subgroup.entity';
import { CategoryEntity } from './infrastructure/persistence/relational/entities/category.entity';
import { EquipmentEntity } from './infrastructure/persistence/relational/entities/equipment.entity';
export declare const EQUIPMENT_ENTITIES: readonly [typeof GroupEntity, typeof SubgroupEntity, typeof CategoryEntity, typeof EquipmentEntity];
export declare const moduleEntities: readonly [typeof GroupEntity, typeof SubgroupEntity, typeof CategoryEntity, typeof EquipmentEntity];
export { GroupEntity, SubgroupEntity, CategoryEntity, EquipmentEntity };
