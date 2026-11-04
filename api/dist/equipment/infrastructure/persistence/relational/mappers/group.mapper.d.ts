import { Group } from '../../../../domain/group';
import { GroupEntity } from '../entities/group.entity';
export declare class GroupMapper {
    static toDomain(raw: GroupEntity): Group;
    static toPersistence(value: Partial<Group>): GroupEntity;
}
