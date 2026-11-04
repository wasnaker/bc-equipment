import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { EquipmentEntity } from '../entities/equipment.entity';
import { EquipmentMapper } from '../mappers/equipment.mapper';
import { EquipmentRepository } from '../../equipment.repository';
import { Equipment } from '../../../../domain/equipment';
import { FilterEquipmentDto, SortEquipmentDto } from '../../../../dto/query-equipment.dto';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class EquipmentRelationalRepository implements EquipmentRepository {
  constructor(@InjectRepository(EquipmentEntity) private readonly repository: Repository<EquipmentEntity>) {}

  async create(data: Omit<Equipment, 'id' | 'ulid' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Equipment> {
    const saved = await this.repository.save(this.repository.create(EquipmentMapper.toPersistence(data)));
    // The database trigger fills code after insert; re-read just like Customer.
    return EquipmentMapper.toDomain(await this.repository.findOneByOrFail({ id: saved.id }));
  }

  private where(filters?: FilterEquipmentDto | null): FindOptionsWhere<EquipmentEntity> {
    const where: FindOptionsWhere<EquipmentEntity> = {};
    if (filters?.subgroupId != null) where.subgroupId = Number(filters.subgroupId);
    if (filters?.categoryId != null) where.categoryId = Number(filters.categoryId);
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    return where;
  }

  async findManyWithPagination({ filterOptions, sortOptions, paginationOptions }: { filterOptions?: FilterEquipmentDto | null; sortOptions?: SortEquipmentDto[] | null; paginationOptions: IPaginationOptions }): Promise<Equipment[]> {
    const where = this.where(filterOptions);
    const search = filterOptions?.search?.trim();
    const rows = await this.repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: search ? [{ ...where, name: ILike(`%${search}%`) }, { ...where, description: ILike(`%${search}%`) }, { ...where, code: ILike(`%${search}%`) }] : where,
      order: sortOptions?.reduce((acc, sort) => ({ ...acc, [sort.orderBy]: sort.order }), { name: 'ASC' }),
    });
    return rows.map(EquipmentMapper.toDomain);
  }

  async findById(id: Equipment['id']): Promise<NullableType<Equipment>> {
    const row = await this.repository.findOne({ where: { id: BigInt(id) } });
    return row ? EquipmentMapper.toDomain(row) : null;
  }

  async findByCategoryId(categoryId: Equipment['categoryId']): Promise<Equipment[]> {
    return (await this.repository.find({ where: { categoryId: Number(categoryId) }, order: { name: 'ASC' } })).map(EquipmentMapper.toDomain);
  }

  async findBySubgroupIdCategoryIdAndName(subgroupId: Equipment['subgroupId'], categoryId: Equipment['categoryId'], name: Equipment['name']): Promise<NullableType<Equipment>> {
    const query = this.repository.createQueryBuilder('equipment')
      .where('"equipment"."subgroupId" = :subgroupId', { subgroupId: Number(subgroupId) })
      .andWhere('lower(btrim("equipment"."name")) = lower(btrim(:name))', { name });
    if (categoryId == null) query.andWhere('"equipment"."categoryId" IS NULL');
    else query.andWhere('"equipment"."categoryId" = :categoryId', { categoryId: Number(categoryId) });
    const row = await query.getOne();
    return row ? EquipmentMapper.toDomain(row) : null;
  }

  async countWithFilter(filters?: FilterEquipmentDto | null): Promise<number> {
    const where = this.where(filters);
    const search = filters?.search?.trim();
    return this.repository.count({ where: search ? [{ ...where, name: ILike(`%${search}%`) }, { ...where, description: ILike(`%${search}%`) }, { ...where, code: ILike(`%${search}%`) }] : where });
  }

  countByCategoryId(categoryId: Equipment['categoryId']): Promise<number> {
    return this.repository.count({ where: { categoryId: Number(categoryId) } });
  }

  async update(id: Equipment['id'], payload: Partial<Equipment>): Promise<Equipment | null> {
    const current = await this.repository.findOne({ where: { id: BigInt(id) } });
    if (!current) return null;
    const update = EquipmentMapper.toPersistence({ ...EquipmentMapper.toDomain(current), ...payload }) as Partial<EquipmentEntity>;
    delete update.id; delete update.ulid; delete update.code;
    await this.repository.update({ id: BigInt(id) }, update);
    return EquipmentMapper.toDomain(await this.repository.findOneByOrFail({ id: BigInt(id) }));
  }

  async remove(id: Equipment['id']): Promise<void> { await this.repository.delete({ id: BigInt(id) }); }
}
