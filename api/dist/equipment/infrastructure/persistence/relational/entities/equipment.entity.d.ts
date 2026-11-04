import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CategoryEntity } from './category.entity';
export declare class EquipmentEntity extends EntityRelationalHelper {
    id: bigint;
    ulid: string;
    code: string | null;
    categoryId: number;
    category?: CategoryEntity;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    assignUlid(): void;
}
