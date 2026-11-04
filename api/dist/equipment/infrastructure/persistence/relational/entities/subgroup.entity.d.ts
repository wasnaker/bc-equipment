import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { GroupEntity } from './group.entity';
export declare class SubgroupEntity extends EntityRelationalHelper {
    id: number;
    groupId: number;
    group?: GroupEntity;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
