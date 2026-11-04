import { Group } from '../domain/group';
export declare class FilterGroupDto {
    search?: string;
}
export declare class SortGroupDto {
    orderBy: keyof Group;
    order: string;
}
export declare class QueryGroupDto {
    page?: number;
    limit?: number;
    filters?: FilterGroupDto | null;
    sort?: SortGroupDto[] | null;
}
