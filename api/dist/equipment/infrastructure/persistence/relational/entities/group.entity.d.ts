import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
export declare class GroupEntity extends EntityRelationalHelper {
    id: number;
    name: string;
    code: string | null;
    abbr: string | null;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
