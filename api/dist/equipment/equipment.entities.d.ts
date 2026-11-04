import { GroupEntity } from './infrastructure/persistence/relational/entities/group.entity';
import { SubgroupEntity } from './infrastructure/persistence/relational/entities/subgroup.entity';
import { CategoryEntity } from './infrastructure/persistence/relational/entities/category.entity';
/** Entity metadata owned by this module; register with the host TypeORM DataSource. */
export declare const EQUIPMENT_ENTITIES: readonly [typeof GroupEntity, typeof SubgroupEntity, typeof CategoryEntity];
/** Standard package contract consumed by the host's generated registry. */
export declare const moduleEntities: readonly [typeof GroupEntity, typeof SubgroupEntity, typeof CategoryEntity];
export { GroupEntity, SubgroupEntity, CategoryEntity };
