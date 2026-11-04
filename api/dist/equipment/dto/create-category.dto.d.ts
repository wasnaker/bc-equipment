import { Category } from '../domain/category';
export declare class CreateCategoryDto {
    subgroupId: Category['subgroupId'];
    name: string;
    description?: string | null;
    isActive?: boolean;
}
