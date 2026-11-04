import { Subgroup } from '../../../../domain/subgroup';
import { SubgroupEntity } from '../entities/subgroup.entity';
export declare class SubgroupMapper {
    static toDomain(raw: SubgroupEntity): Subgroup;
    static toPersistence(value: Partial<Subgroup>): SubgroupEntity;
}
