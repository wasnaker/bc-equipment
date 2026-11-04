import { Category } from '../../../../domain/category';
import { CategoryEntity } from '../entities/category.entity';
export declare class CategoryMapper {
    static toDomain(raw: CategoryEntity): Category;
    static toPersistence(value: Partial<Category>): CategoryEntity;
}
