import { Repository } from 'typeorm';
import { EquipmentEntity } from '../entities/equipment.entity';
import { EquipmentRepository } from '../../equipment.repository';
import { Equipment } from '../../../../domain/equipment';
import { FilterEquipmentDto, SortEquipmentDto } from '../../../../dto/query-equipment.dto';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
export declare class EquipmentRelationalRepository implements EquipmentRepository {
    private readonly repository;
    constructor(repository: Repository<EquipmentEntity>);
    create(data: Omit<Equipment, 'id' | 'ulid' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Equipment>;
    private where;
    findManyWithPagination({ filterOptions, sortOptions, paginationOptions }: {
        filterOptions?: FilterEquipmentDto | null;
        sortOptions?: SortEquipmentDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<Equipment[]>;
    findById(id: Equipment['id']): Promise<NullableType<Equipment>>;
    findByCategoryId(categoryId: Equipment['categoryId']): Promise<Equipment[]>;
    findBySubgroupIdCategoryIdAndName(subgroupId: Equipment['subgroupId'], categoryId: Equipment['categoryId'], name: Equipment['name']): Promise<NullableType<Equipment>>;
    countWithFilter(filters?: FilterEquipmentDto | null): Promise<number>;
    countByCategoryId(categoryId: Equipment['categoryId']): Promise<number>;
    update(id: Equipment['id'], payload: Partial<Equipment>): Promise<Equipment | null>;
    remove(id: Equipment['id']): Promise<void>;
}
