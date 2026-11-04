import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CategoryEntity } from './category.entity';
import { SubgroupEntity } from './subgroup.entity';
export declare class EquipmentEntity extends EntityRelationalHelper {
    id: bigint;
    ulid: string;
    code: string | null;
    subgroupId: number;
    subgroup?: SubgroupEntity;
    categoryId: number | null;
    category?: CategoryEntity | null;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    assignUlid(): void;
}
