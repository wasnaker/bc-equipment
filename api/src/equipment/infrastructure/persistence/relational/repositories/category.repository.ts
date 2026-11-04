import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterCategoryDto, SortCategoryDto } from '../../../../dto/query-category.dto';
import { Category } from '../../../../domain/category';
import { CategoryRepository } from '../../category.repository';
import { CategoryMapper } from '../mappers/category.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CategoriesRelationalRepository implements CategoryRepository {
  constructor(@InjectRepository(CategoryEntity) private readonly repository: Repository<CategoryEntity>) {}

  async create(data: Category): Promise<Category> {
    return CategoryMapper.toDomain(await this.repository.save(this.repository.create(CategoryMapper.toPersistence(data))));
  }

  private buildWhere(filters?: FilterCategoryDto | null): FindOptionsWhere<CategoryEntity> {
    const where: FindOptionsWhere<CategoryEntity> = {};
    if (filters?.subgroupId != null) where.subgroupId = Number(filters.subgroupId);
    return where;
  }

  async findManyWithPagination({ filterOptions, sortOptions, paginationOptions }: { filterOptions?: FilterCategoryDto | null; sortOptions?: SortCategoryDto[] | null; paginationOptions: IPaginationOptions }): Promise<Category[]> {
    const where = this.buildWhere(filterOptions);
    const search = filterOptions?.search?.trim();
    const rows = await this.repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: search ? [{ ...where, name: ILike(`%${search}%`) }, { ...where, description: ILike(`%${search}%`) }] : where,
      order: sortOptions?.reduce((acc, sort) => ({ ...acc, [sort.orderBy]: sort.order }), { name: 'ASC' }),
    });
    return rows.map(CategoryMapper.toDomain);
  }

  async findAll(): Promise<Category[]> {
    return (await this.repository.find({ order: { name: 'ASC' } })).map(CategoryMapper.toDomain);
  }

  async findById(id: Category['id']): Promise<NullableType<Category>> {
    const row = await this.repository.findOne({ where: { id: Number(id) } });
    return row ? CategoryMapper.toDomain(row) : null;
  }

  async findBySubgroupId(subgroupId: Category['subgroupId']): Promise<Category[]> {
    return (await this.repository.find({ where: { subgroupId: Number(subgroupId) }, order: { name: 'ASC' } })).map(CategoryMapper.toDomain);
  }

  async findBySubgroupIdAndName(subgroupId: Category['subgroupId'], name: Category['name']): Promise<NullableType<Category>> {
    const row = await this.repository.findOne({ where: { subgroupId: Number(subgroupId), name } });
    return row ? CategoryMapper.toDomain(row) : null;
  }

  async countBySubgroupId(subgroupId: Category['subgroupId']): Promise<number> {
    return this.repository.count({ where: { subgroupId: Number(subgroupId) } });
  }

  async countAll(): Promise<number> { return this.repository.count(); }

  async countWithFilter(filters?: FilterCategoryDto | null): Promise<number> {
    const where = this.buildWhere(filters);
    const search = filters?.search?.trim();
    return this.repository.count({ where: search ? [{ ...where, name: ILike(`%${search}%`) }, { ...where, description: ILike(`%${search}%`) }] : where });
  }

  async update(id: Category['id'], payload: Partial<Category>): Promise<Category | null> {
    const row = await this.repository.findOne({ where: { id: Number(id) } });
    if (!row) return null;
    return CategoryMapper.toDomain(await this.repository.save(this.repository.create(CategoryMapper.toPersistence({ ...CategoryMapper.toDomain(row), ...payload }))));
  }

  async remove(id: Category['id']): Promise<void> { await this.repository.delete(Number(id)); }
  async removeBySubgroupId(subgroupId: Category['subgroupId']): Promise<void> { await this.repository.delete({ subgroupId: Number(subgroupId) }); }
}
