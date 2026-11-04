import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  async createGroup(dto: CreateGroupDto): Promise<Group> {
    if (await this.groupRepository.findByName(dto.name)) {
      throw new UnprocessableEntityException({ status: HttpStatus.UNPROCESSABLE_ENTITY, errors: { name: 'groupNameAlreadyExists' } });
    }
    return this.groupRepository.create({
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      isActive: dto.isActive ?? true,
    });
  }

  async findManyGroupsWithPagination(args: { filterOptions?: FilterGroupDto | null; sortOptions?: SortGroupDto[] | null; paginationOptions: IPaginationOptions }): Promise<Group[]> {
    return this.groupRepository.findManyWithPagination(args);
  }

  findGroupById(id: Group['id']): Promise<NullableType<Group>> {
    return this.groupRepository.findById(id);
  }

  async updateGroup(id: Group['id'], dto: UpdateGroupDto): Promise<Group> {
    const current = await this.groupRepository.findById(id);
    if (!current) throw new UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
    if (dto.name?.trim()) {
      const duplicate = await this.groupRepository.findByName(dto.name.trim());
      if (duplicate && Number(duplicate.id) !== Number(id)) throw new UnprocessableEntityException({ status: 422, errors: { name: 'groupNameAlreadyExists' } });
    }
    const updated = await this.groupRepository.update(id, { ...dto, name: dto.name?.trim() });
    if (!updated) throw new UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
    return updated;
  }

  async removeGroup(id: Group['id']): Promise<void> {
    if (!(await this.groupRepository.findById(id))) throw new UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
    await this.groupRepository.remove(id);
  }

  countGroups(filters?: FilterGroupDto | null): Promise<number> {
    return this.groupRepository.countWithFilter(filters);
  }

  async createSubgroup(dto: CreateSubgroupDto): Promise<Subgroup> {
    if (!(await this.groupRepository.findById(dto.groupId))) throw new UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
    if (await this.subgroupRepository.findByGroupIdAndName(dto.groupId, dto.name.trim())) throw new UnprocessableEntityException({ status: 422, errors: { name: 'subgroupNameAlreadyExists' } });
    return this.subgroupRepository.create({
      groupId: dto.groupId,
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      isActive: dto.isActive ?? true,
    });
  }

  findManySubgroupsWithPagination(args: { filterOptions?: FilterSubgroupDto | null; sortOptions?: SortSubgroupDto[] | null; paginationOptions: IPaginationOptions }): Promise<Subgroup[]> {
    return this.subgroupRepository.findManyWithPagination(args);
  }

  findSubgroupById(id: Subgroup['id']): Promise<NullableType<Subgroup>> {
    return this.subgroupRepository.findById(id);
  }

  async updateSubgroup(id: Subgroup['id'], dto: UpdateSubgroupDto): Promise<Subgroup> {
    const current = await this.subgroupRepository.findById(id);
    if (!current) throw new UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
    const targetGroupId = dto.groupId ?? current.groupId;
    if (dto.groupId !== undefined && !(await this.groupRepository.findById(dto.groupId))) throw new UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
    const targetName = dto.name?.trim() ?? current.name;
    const duplicate = await this.subgroupRepository.findByGroupIdAndName(targetGroupId, targetName);
    if (duplicate && Number(duplicate.id) !== Number(id)) throw new UnprocessableEntityException({ status: 422, errors: { name: 'subgroupNameAlreadyExists' } });
    const updated = await this.subgroupRepository.update(id, { ...dto, name: dto.name?.trim() });
    if (!updated) throw new UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
    return updated;
  }

  async removeSubgroup(id: Subgroup['id']): Promise<void> {
    if (!(await this.subgroupRepository.findById(id))) throw new UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
    await this.subgroupRepository.remove(id);
  }

  countSubgroups(filters?: FilterSubgroupDto | null): Promise<number> {
    return this.subgroupRepository.countWithFilter(filters);
  }

  countSubgroupsByGroupId(groupId: Subgroup['groupId']): Promise<number> {
    return this.subgroupRepository.countByGroupId(groupId);
  }
}
