import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Equipment } from '../../domain/equipment';
import { FilterEquipmentDto, SortEquipmentDto } from '../../dto/query-equipment.dto';
export declare abstract class EquipmentRepository {
    abstract create(data: Omit<Equipment, 'id' | 'ulid' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Equipment>;
    abstract findManyWithPagination(args: {
        filterOptions?: FilterEquipmentDto | null;
        sortOptions?: SortEquipmentDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<Equipment[]>;
    abstract findById(id: Equipment['id']): Promise<NullableType<Equipment>>;
    abstract findByCategoryId(categoryId: Equipment['categoryId']): Promise<Equipment[]>;
    abstract findBySubgroupIdCategoryIdAndName(subgroupId: Equipment['subgroupId'], categoryId: Equipment['categoryId'], name: Equipment['name']): Promise<NullableType<Equipment>>;
    abstract countWithFilter(filters?: FilterEquipmentDto | null): Promise<number>;
    abstract countByCategoryId(categoryId: Equipment['categoryId']): Promise<number>;
    abstract update(id: Equipment['id'], payload: DeepPartial<Equipment>): Promise<Equipment | null>;
    abstract remove(id: Equipment['id']): Promise<void>;
}
