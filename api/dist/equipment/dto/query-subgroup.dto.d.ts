import { Subgroup } from '../domain/subgroup';
export declare class FilterSubgroupDto {
    groupId?: Subgroup['groupId'];
    search?: string;
}
export declare class SortSubgroupDto {
    orderBy: keyof Subgroup;
    order: string;
}
export declare class QuerySubgroupDto {
    page?: number;
    limit?: number;
    groupId?: Subgroup['groupId'];
    filters?: FilterSubgroupDto | null;
    sort?: SortSubgroupDto[] | null;
}
