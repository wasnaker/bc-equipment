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
export class SubgroupsRelationalRepository implements SubgroupRepository {
  constructor(@InjectRepository(SubgroupEntity) private readonly repository: Repository<SubgroupEntity>) {}

  async create(data: Subgroup): Promise<Subgroup> {
    return SubgroupMapper.toDomain(await this.repository.save(this.repository.create(SubgroupMapper.toPersistence(data))));
  }

  private buildWhere(filters?: FilterSubgroupDto | null): FindOptionsWhere<SubgroupEntity> {
    const where: FindOptionsWhere<SubgroupEntity> = {};
    if (filters?.groupId != null) where.groupId = Number(filters.groupId);
    return where;
  }

  async findManyWithPagination({ filterOptions, sortOptions, paginationOptions }: { filterOptions?: FilterSubgroupDto | null; sortOptions?: SortSubgroupDto[] | null; paginationOptions: IPaginationOptions }): Promise<Subgroup[]> {
    const where = this.buildWhere(filterOptions);
    const search = filterOptions?.search?.trim();
    const rows = await this.repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: search ? [{ ...where, name: ILike(`%${search}%`) }, { ...where, description: ILike(`%${search}%`) }] : where,
      order: sortOptions?.reduce((acc, sort) => ({ ...acc, [sort.orderBy]: sort.order }), { name: 'ASC' }),
    });
    return rows.map(SubgroupMapper.toDomain);
  }

  async findAll(): Promise<Subgroup[]> {
    return (await this.repository.find({ order: { name: 'ASC' } })).map(SubgroupMapper.toDomain);
  }

  async findById(id: Subgroup['id']): Promise<NullableType<Subgroup>> {
    const row = await this.repository.findOne({ where: { id: Number(id) } });
    return row ? SubgroupMapper.toDomain(row) : null;
  }

  async findByGroupId(groupId: Subgroup['groupId']): Promise<Subgroup[]> {
    return (await this.repository.find({ where: { groupId: Number(groupId) }, order: { name: 'ASC' } })).map(SubgroupMapper.toDomain);
  }

  async findByGroupIdAndName(groupId: Subgroup['groupId'], name: Subgroup['name']): Promise<NullableType<Subgroup>> {
    const row = await this.repository.findOne({ where: { groupId: Number(groupId), name } });
    return row ? SubgroupMapper.toDomain(row) : null;
  }

  async countByGroupId(groupId: Subgroup['groupId']): Promise<number> {
    return this.repository.count({ where: { groupId: Number(groupId) } });
  }

  async countAll(): Promise<number> { return this.repository.count(); }

  async countWithFilter(filters?: FilterSubgroupDto | null): Promise<number> {
    const where = this.buildWhere(filters);
    const search = filters?.search?.trim();
    return this.repository.count({ where: search ? [{ ...where, name: ILike(`%${search}%`) }, { ...where, description: ILike(`%${search}%`) }] : where });
  }

  async update(id: Subgroup['id'], payload: Partial<Subgroup>): Promise<Subgroup | null> {
    const row = await this.repository.findOne({ where: { id: Number(id) } });
    if (!row) return null;
    return SubgroupMapper.toDomain(await this.repository.save(this.repository.create(SubgroupMapper.toPersistence({ ...SubgroupMapper.toDomain(row), ...payload }))));
  }

  async remove(id: Subgroup['id']): Promise<void> { await this.repository.delete(Number(id)); }
  async removeByGroupId(groupId: Subgroup['groupId']): Promise<void> { await this.repository.delete({ groupId: Number(groupId) }); }
}
