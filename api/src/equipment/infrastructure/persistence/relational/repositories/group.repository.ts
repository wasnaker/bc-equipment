import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { GroupEntity } from '../entities/group.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterGroupDto, SortGroupDto } from '../../../../dto/query-group.dto';
import { Group } from '../../../../domain/group';
import { GroupRepository } from '../../group.repository';
import { GroupMapper } from '../mappers/group.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class GroupsRelationalRepository implements GroupRepository {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async create(data: Group): Promise<Group> {
    const persistenceModel = GroupMapper.toPersistence(data);
    const newEntity = await this.groupRepository.save(
      this.groupRepository.create(persistenceModel),
    );
    return GroupMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterGroupDto | null;
    sortOptions?: SortGroupDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Group[]> {
    const search = filterOptions?.search?.trim();
    // OR-search across the fields exposed by the group list table.
    const where: FindOptionsWhere<GroupEntity>[] = search
      ? [
          { name: ILike(`%${search}%`) },
          { isoCode: ILike(`%${search}%`) },
        ]
      : [{}];

    const entities = await this.groupRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        { name: 'ASC' },
      ),
    });

    return entities.map((group) => GroupMapper.toDomain(group));
  }

  async findAll(): Promise<Group[]> {
    const entities = await this.groupRepository.find({ order: { name: 'ASC' } });
    return entities.map((group) => GroupMapper.toDomain(group));
  }

  async findById(id: Group['id']): Promise<NullableType<Group>> {
    const entity = await this.groupRepository.findOne({
      where: { id: Number(id) },
    });
    return entity ? GroupMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<NullableType<Group>> {
    const entity = await this.groupRepository.findOne({
      where: { name },
    });
    return entity ? GroupMapper.toDomain(entity) : null;
  }

  async findByIsoCode(isoCode: Group['isoCode']): Promise<NullableType<Group>> {
    if (!isoCode) return null;
    const entity = await this.groupRepository.findOne({ where: { isoCode } });
    return entity ? GroupMapper.toDomain(entity) : null;
  }

  async countAll(): Promise<number> {
    return this.groupRepository.count();
  }

  async countWithFilter(
    filterOptions?: FilterGroupDto | null,
  ): Promise<number> {
    const search = filterOptions?.search?.trim();
    if (!search) {
      return this.groupRepository.count();
    }
    return this.groupRepository.count({
      where: [
        { name: ILike(`%${search}%`) },
        { isoCode: ILike(`%${search}%`) },
      ],
    });
  }

  async update(id: Group['id'], payload: Partial<Group>): Promise<Group> {
    const entity = await this.groupRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Group not found');
    }

    const updatedEntity = await this.groupRepository.save(
      this.groupRepository.create(
        GroupMapper.toPersistence({
          ...GroupMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return GroupMapper.toDomain(updatedEntity);
  }

  async remove(id: Group['id']): Promise<void> {
    await this.groupRepository.delete(Number(id));
  }
}