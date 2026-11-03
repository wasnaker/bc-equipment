import { GroupEntity } from './infrastructure/persistence/relational/entities/group.entity';
import { SubgroupEntity } from './infrastructure/persistence/relational/entities/subgroup.entity';

/** Entity metadata owned by this module; register with the host TypeORM DataSource. */
export const EQUIPMENT_ENTITIES = [GroupEntity, SubgroupEntity] as const;

/** Standard package contract consumed by the host's generated registry. */
export const moduleEntities = EQUIPMENT_ENTITIES;

export { GroupEntity, SubgroupEntity };
