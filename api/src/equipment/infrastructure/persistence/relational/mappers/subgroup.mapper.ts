import { Subgroup } from '../../../../domain/subgroup';
import { SubgroupEntity } from '../entities/subgroup.entity';

export class SubgroupMapper {
  static toDomain(raw: SubgroupEntity): Subgroup {
    const domainEntity = new Subgroup();
    domainEntity.id = raw.id;
    domainEntity.groupId = raw.groupId;
    domainEntity.name = raw.name;
    domainEntity.code = raw.code;
    domainEntity.type = raw.type as Subgroup['type'];
    domainEntity.isActive = raw.isActive;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Partial<Subgroup>): SubgroupEntity {
    const persistenceEntity = new SubgroupEntity();
    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    if (domainEntity.groupId !== undefined) {
      persistenceEntity.groupId = Number(domainEntity.groupId);
    }
    persistenceEntity.name = domainEntity.name as string;
    if (domainEntity.code !== undefined) {
      persistenceEntity.code = domainEntity.code;
    }
    persistenceEntity.type = domainEntity.type as string;
    persistenceEntity.isActive = domainEntity.isActive ?? true;
    persistenceEntity.createdAt = domainEntity.createdAt as Date;
    persistenceEntity.updatedAt = domainEntity.updatedAt as Date;
    return persistenceEntity;
  }
}