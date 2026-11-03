import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { FilterGroupDto, SortGroupDto } from '../dto/query-group.dto';
import { CreateSubgroupDto } from '../dto/create-subgroup.dto';
import { UpdateSubgroupDto } from '../dto/update-subgroup.dto';
import { FilterSubgroupDto, SortSubgroupDto } from '../dto/query-subgroup.dto';
import { Group } from '../domain/group';
import { Subgroup } from '../domain/subgroup';
import { GroupRepository } from '../infrastructure/persistence/group.repository';
import { SubgroupRepository } from '../infrastructure/persistence/subgroup.repository';
import { NullableType } from '../../utils/types/nullable.type';
import { IPaginationOptions } from '../../utils/types/pagination-options';

@Injectable()
export class EquipmentService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly subgroupRepository: SubgroupRepository,
  ) {}

  // ─── Groups ────────────────────────────────────────────────────────────

  async createGroup(
    createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    const existing = await this.groupRepository.findByName(
      createGroupDto.name,
    );
    if (existing) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          name: 'groupNameAlreadyExists',
        },
      });
    }

    if (createGroupDto.isoCode) {
      const existingIsoCode = await this.groupRepository.findByIsoCode(
        createGroupDto.isoCode,
      );
      if (existingIsoCode) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { isoCode: 'groupIsoCodeAlreadyExists' },
        });
      }
    }

    return this.groupRepository.create({
      name: createGroupDto.name,
      isoCode: createGroupDto.isoCode ?? null,
      latitude: createGroupDto.latitude ?? null,
      longitude: createGroupDto.longitude ?? null,
    });
  }

  async findManyGroupsWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterGroupDto | null;
    sortOptions?: SortGroupDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Group[]> {
    return this.groupRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findGroupById(id: Group['id']): Promise<NullableType<Group>> {
    return this.groupRepository.findById(id);
  }

  async findGroupByIsoCode(
    isoCode: Group['isoCode'],
  ): Promise<NullableType<Group>> {
    return this.groupRepository.findByIsoCode(isoCode);
  }

  async updateGroup(
    id: Group['id'],
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          group: 'groupNotExists',
        },
      });
    }

    if (updateGroupDto.name) {
      const existing = await this.groupRepository.findByName(
        updateGroupDto.name,
      );
      if (existing && existing.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            name: 'groupNameAlreadyExists',
          },
        });
      }
    }

    if (updateGroupDto.isoCode) {
      const existingIsoCode = await this.groupRepository.findByIsoCode(
        updateGroupDto.isoCode,
      );
      if (existingIsoCode && existingIsoCode.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { isoCode: 'groupIsoCodeAlreadyExists' },
        });
      }
    }

    const updated = await this.groupRepository.update(id, {
      ...updateGroupDto,
    });
    if (!updated) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          group: 'groupNotExists',
        },
      });
    }
    return updated;
  }

  async removeGroup(id: Group['id']): Promise<void> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          group: 'groupNotExists',
        },
      });
    }

    // The PostgreSQL foreign key owns the cascade. Delete the parent once so
    // the database guarantees atomic referential integrity.
    await this.groupRepository.remove(id);
  }

  async countAllGroups(): Promise<number> {
    return this.groupRepository.countAll();
  }

  async countGroups(filterOptions?: FilterGroupDto | null): Promise<number> {
    if (this.groupRepository.countWithFilter) {
      return this.groupRepository.countWithFilter(filterOptions);
    }
    return this.groupRepository.countAll();
  }

  // ─── Regencies ─────────────────────────────────────────────────────────────

  async createSubgroup(createSubgroupDto: CreateSubgroupDto): Promise<Subgroup> {
    const group = await this.groupRepository.findById(
      createSubgroupDto.groupId,
    );
    if (!group) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          group: 'groupNotExists',
        },
      });
    }

    const existing = await this.subgroupRepository.findByGroupIdAndName(
      createSubgroupDto.groupId,
      createSubgroupDto.name,
    );
    if (existing) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { name: 'subgroupNameAlreadyExists' },
      });
    }

    return this.subgroupRepository.create({
      groupId: createSubgroupDto.groupId,
      name: createSubgroupDto.name,
      type: createSubgroupDto.type,
      isActive: createSubgroupDto.isActive ?? true,
    });
  }

  async findManyRegenciesWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterSubgroupDto | null;
    sortOptions?: SortSubgroupDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Subgroup[]> {
    return this.subgroupRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findRegenciesByGroupId(
    groupId: Subgroup['groupId'],
  ): Promise<Subgroup[]> {
    return this.subgroupRepository.findByGroupId(groupId);
  }

  async findSubgroupById(id: Subgroup['id']): Promise<NullableType<Subgroup>> {
    return this.subgroupRepository.findById(id);
  }

  async updateSubgroup(
    id: Subgroup['id'],
    updateSubgroupDto: UpdateSubgroupDto,
  ): Promise<Subgroup> {
    const subgroup = await this.subgroupRepository.findById(id);
    if (!subgroup) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          subgroup: 'subgroupNotExists',
        },
      });
    }

    if (updateSubgroupDto.groupId !== undefined) {
      const group = await this.groupRepository.findById(
        updateSubgroupDto.groupId,
      );
      if (!group) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            group: 'groupNotExists',
          },
        });
      }
    }

    const targetGroupId = updateSubgroupDto.groupId ?? subgroup.groupId;
    const targetName = updateSubgroupDto.name ?? subgroup.name;
    const existing = await this.subgroupRepository.findByGroupIdAndName(
      targetGroupId,
      targetName,
    );
    if (existing && existing.id !== id) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { name: 'subgroupNameAlreadyExists' },
      });
    }

    const updated = await this.subgroupRepository.update(id, {
      ...updateSubgroupDto,
    });
    if (!updated) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          subgroup: 'subgroupNotExists',
        },
      });
    }
    return updated;
  }

  async removeSubgroup(id: Subgroup['id']): Promise<void> {
    const subgroup = await this.subgroupRepository.findById(id);
    if (!subgroup) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          subgroup: 'subgroupNotExists',
        },
      });
    }

    await this.subgroupRepository.remove(id);
  }

  async countAllRegencies(): Promise<number> {
    return this.subgroupRepository.countAll();
  }

  async countRegencies(
    filterOptions?: FilterSubgroupDto | null,
  ): Promise<number> {
    if (this.subgroupRepository.countWithFilter) {
      return this.subgroupRepository.countWithFilter(filterOptions);
    }
    if (filterOptions?.groupId !== undefined) {
      return this.subgroupRepository.countByGroupId(filterOptions.groupId);
    }
    return this.subgroupRepository.countAll();
  }

  async countRegenciesByGroupId(
    groupId: Subgroup['groupId'],
  ): Promise<number> {
    return this.subgroupRepository.countByGroupId(groupId);
  }
}