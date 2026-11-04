import { CreateCategoryDto } from './create-category.dto';
import { Category } from '../domain/category';
declare const UpdateCategoryDto_base: import("@nestjs/common").Type<Partial<CreateCategoryDto>>;
export declare class UpdateCategoryDto extends UpdateCategoryDto_base {
    subgroupId?: Category['subgroupId'];
    isActive?: boolean;
}
export {};
