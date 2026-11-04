import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { SubgroupEntity } from './subgroup.entity';
export declare class CategoryEntity extends EntityRelationalHelper {
    id: number;
    subgroupId: number;
    subgroup?: SubgroupEntity;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
