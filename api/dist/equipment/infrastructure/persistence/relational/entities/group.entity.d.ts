import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
export declare class GroupEntity extends EntityRelationalHelper {
    id: number;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
