import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Category } from '../../domain/category';
import { FilterCategoryDto, SortCategoryDto } from '../../dto/query-category.dto';
export declare abstract class CategoryRepository {
    abstract create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category>;
    abstract findManyWithPagination(args: {
        filterOptions?: FilterCategoryDto | null;
        sortOptions?: SortCategoryDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<Category[]>;
    abstract findAll(): Promise<Category[]>;
    abstract findById(id: Category['id']): Promise<NullableType<Category>>;
    abstract findBySubgroupId(subgroupId: Category['subgroupId']): Promise<Category[]>;
    abstract findBySubgroupIdAndName(subgroupId: Category['subgroupId'], name: Category['name']): Promise<NullableType<Category>>;
    abstract countBySubgroupId(subgroupId: Category['subgroupId']): Promise<number>;
    abstract countAll(): Promise<number>;
    abstract countWithFilter(filterOptions?: FilterCategoryDto | null): Promise<number>;
    abstract update(id: Category['id'], payload: DeepPartial<Category>): Promise<Category | null>;
    abstract remove(id: Category['id']): Promise<void>;
    abstract removeBySubgroupId(subgroupId: Category['subgroupId']): Promise<void>;
}
