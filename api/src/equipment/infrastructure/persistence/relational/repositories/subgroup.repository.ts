import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { SubgroupEntity } from '../entities/subgroup.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterSubgroupDto, SortSubgroupDto } from '../../../../dto/query-subgroup.dto';
import { Subgroup } from '../../../../domain/subgroup';
import { SubgroupRepository } from '../../subgroup.repository';
import { SubgroupMapper } from '../mappers/subgroup.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class RegenciesRelationalRepository implements SubgroupRepository {
  constructor(
    @InjectRepository(SubgroupEntity)
    private readonly subgroupRepository: Repository<SubgroupEntity>,
  ) {}

  async create(data: Subgroup): Promise<Subgroup> {
    const persistenceModel = SubgroupMapper.toPersistence(data);
    const newEntity = await this.subgroupRepository.save(
      this.subgroupRepository.create(persistenceModel),
    );
    return SubgroupMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterSubgroupDto | null;
    sortOptions?: SortSubgroupDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Subgroup[]> {
    const where: FindOptionsWhere<SubgroupEntity> = this.buildWhere(filterOptions);

    const entities = await this.subgroupRepository.find({
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

    return entities.map((subgroup) => SubgroupMapper.toDomain(subgroup));
  }

  async findAll(): Promise<Subgroup[]> {
    const entities = await this.subgroupRepository.find({ order: { name: 'ASC' } });
    return entities.map((subgroup) => SubgroupMapper.toDomain(subgroup));
  }

  async findById(id: Subgroup['id']): Promise<NullableType<Subgroup>> {
    const entity = await this.subgroupRepository.findOne({
      where: { id: Number(id) },
    });
    return entity ? SubgroupMapper.toDomain(entity) : null;
  }

  async findByGroupId(groupId: Subgroup['groupId']): Promise<Subgroup[]> {
    const entities = await this.subgroupRepository.find({
      where: { groupId: Number(groupId) },
      order: { name: 'ASC' },
    });
    return entities.map((subgroup) => SubgroupMapper.toDomain(subgroup));
  }

  async findByGroupIdAndName(
    groupId: Subgroup['groupId'],
    name: Subgroup['name'],
  ): Promise<NullableType<Subgroup>> {
    const entity = await this.subgroupRepository.findOne({
      where: { groupId: Number(groupId), name },
    });
    return entity ? SubgroupMapper.toDomain(entity) : null;
  }

  async countByGroupId(groupId: Subgroup['groupId']): Promise<number> {
    return this.subgroupRepository.count({
      where: { groupId: Number(groupId) },
    });
  }

  async countAll(): Promise<number> {
    return this.subgroupRepository.count();
  }

  async countWithFilter(
    filterOptions?: FilterSubgroupDto | null,
  ): Promise<number> {
    const where: any = {};
    if (filterOptions?.groupId !== undefined && filterOptions.groupId !== null) {
      where.groupId = Number(filterOptions.groupId);
    }
    if (filterOptions?.type) {
      where.type = filterOptions.type;
    }
    return this.subgroupRepository.count({ where });
  }

  async update(id: Subgroup['id'], payload: Partial<Subgroup>): Promise<Subgroup> {
    const entity = await this.subgroupRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Subgroup not found');
    }

    const updatedEntity = await this.subgroupRepository.save(
      this.subgroupRepository.create(
        SubgroupMapper.toPersistence({
          ...SubgroupMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SubgroupMapper.toDomain(updatedEntity);
  }

  async remove(id: Subgroup['id']): Promise<void> {
    await this.subgroupRepository.delete(Number(id));
  }

  async removeByGroupId(groupId: Subgroup['groupId']): Promise<void> {
    await this.subgroupRepository.delete({ groupId: Number(groupId) });
  }

  private buildWhere(filterOptions?: FilterSubgroupDto | null): FindOptionsWhere<SubgroupEntity> {
    const where: FindOptionsWhere<SubgroupEntity> = {};
    if (filterOptions?.groupId !== undefined && filterOptions.groupId !== null) {
      where.groupId = Number(filterOptions.groupId);
    }
    if (filterOptions?.type) {
      where.type = filterOptions.type;
    }
    return where;
  }
}