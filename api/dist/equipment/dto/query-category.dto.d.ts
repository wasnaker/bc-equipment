import { Category } from '../domain/category';
export declare class FilterCategoryDto {
    subgroupId?: Category['subgroupId'];
    search?: string;
}
export declare class SortCategoryDto {
    orderBy: keyof Category;
    order: string;
}
export declare class QueryCategoryDto {
    page?: number;
    limit?: number;
    subgroupId?: Category['subgroupId'];
    filters?: FilterCategoryDto | null;
    sort?: SortCategoryDto[] | null;
}
