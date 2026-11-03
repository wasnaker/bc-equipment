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
  constructor(@InjectRepository(GroupEntity) private readonly repository: Repository<GroupEntity>) {}

  async create(data: Group): Promise<Group> {
    return GroupMapper.toDomain(await this.repository.save(this.repository.create(GroupMapper.toPersistence(data))));
  }

  async findManyWithPagination({ filterOptions, sortOptions, paginationOptions }: { filterOptions?: FilterGroupDto | null; sortOptions?: SortGroupDto[] | null; paginationOptions: IPaginationOptions }): Promise<Group[]> {
    const search = filterOptions?.search?.trim();
    const where: FindOptionsWhere<GroupEntity>[] = search ? [{ name: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }] : [{}];
    const rows = await this.repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      order: sortOptions?.reduce((acc, sort) => ({ ...acc, [sort.orderBy]: sort.order }), { name: 'ASC' }),
    });
    return rows.map(GroupMapper.toDomain);
  }

  async findAll(): Promise<Group[]> {
    return (await this.repository.find({ order: { name: 'ASC' } })).map(GroupMapper.toDomain);
  }

  async findById(id: Group['id']): Promise<NullableType<Group>> {
    const row = await this.repository.findOne({ where: { id: Number(id) } });
    return row ? GroupMapper.toDomain(row) : null;
  }

  async findByName(name: string): Promise<NullableType<Group>> {
    const row = await this.repository.findOne({ where: { name } });
    return row ? GroupMapper.toDomain(row) : null;
  }

  async countAll(): Promise<number> { return this.repository.count(); }

  async countWithFilter(filterOptions?: FilterGroupDto | null): Promise<number> {
    const search = filterOptions?.search?.trim();
    if (!search) return this.repository.count();
    return this.repository.count({ where: [{ name: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }] });
  }

  async update(id: Group['id'], payload: Partial<Group>): Promise<Group | null> {
    const row = await this.repository.findOne({ where: { id: Number(id) } });
    if (!row) return null;
    return GroupMapper.toDomain(await this.repository.save(this.repository.create(GroupMapper.toPersistence({ ...GroupMapper.toDomain(row), ...payload }))));
  }

  async remove(id: Group['id']): Promise<void> { await this.repository.delete(Number(id)); }
}
