import { Group } from '../../../../domain/group';
import { GroupEntity } from '../entities/group.entity';

export class GroupMapper {
  static toDomain(raw: GroupEntity): Group {
    const domainEntity = new Group();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.isoCode = raw.isoCode;
    domainEntity.latitude = raw.latitude === null ? null : Number(raw.latitude);
    domainEntity.longitude =
      raw.longitude === null ? null : Number(raw.longitude);
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Partial<Group>): GroupEntity {
    const persistenceEntity = new GroupEntity();
    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name as string;
    persistenceEntity.isoCode = domainEntity.isoCode ?? null;
    persistenceEntity.latitude = domainEntity.latitude ?? null;
    persistenceEntity.longitude = domainEntity.longitude ?? null;
    persistenceEntity.createdAt = domainEntity.createdAt as Date;
    persistenceEntity.updatedAt = domainEntity.updatedAt as Date;
    return persistenceEntity;
  }
}