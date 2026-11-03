import { ProvinceEntity } from './infrastructure/persistence/relational/entities/province.entity';
import { RegencyEntity } from './infrastructure/persistence/relational/entities/regency.entity';

/** Entity metadata owned by this module; register with the host TypeORM DataSource. */
export const REGION_ENTITIES = [ProvinceEntity, RegencyEntity] as const;

/** Standard package contract consumed by the host's generated registry. */
export const moduleEntities = REGION_ENTITIES;

export { ProvinceEntity, RegencyEntity };
