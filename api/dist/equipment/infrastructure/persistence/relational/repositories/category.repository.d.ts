import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterCategoryDto, SortCategoryDto } from '../../../../dto/query-category.dto';
import { Category } from '../../../../domain/category';
import { CategoryRepository } from '../../category.repository';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
export declare class CategoriesRelationalRepository implements CategoryRepository {
    private readonly repository;
    constructor(repository: Repository<CategoryEntity>);
    create(data: Category): Promise<Category>;
    private buildWhere;
    findManyWithPagination({ filterOptions, sortOptions, paginationOptions }: {
        filterOptions?: FilterCategoryDto | null;
        sortOptions?: SortCategoryDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<Category[]>;
    findAll(): Promise<Category[]>;
    findById(id: Category['id']): Promise<NullableType<Category>>;
    findBySubgroupId(subgroupId: Category['subgroupId']): Promise<Category[]>;
    findBySubgroupIdAndName(subgroupId: Category['subgroupId'], name: Category['name']): Promise<NullableType<Category>>;
    countBySubgroupId(subgroupId: Category['subgroupId']): Promise<number>;
    countAll(): Promise<number>;
    countWithFilter(filters?: FilterCategoryDto | null): Promise<number>;
    update(id: Category['id'], payload: Partial<Category>): Promise<Category | null>;
    remove(id: Category['id']): Promise<void>;
    removeBySubgroupId(subgroupId: Category['subgroupId']): Promise<void>;
}
