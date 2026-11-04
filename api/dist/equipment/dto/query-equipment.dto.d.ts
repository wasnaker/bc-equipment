export declare class FilterEquipmentDto {
    subgroupId?: number;
    categoryId?: number;
    search?: string;
    isActive?: boolean;
}
export declare class SortEquipmentDto {
    orderBy: 'name' | 'code' | 'createdAt' | 'updatedAt';
    order: 'ASC' | 'DESC';
}
export declare class QueryEquipmentDto {
    subgroupId?: number;
    page: number;
    limit: number;
    categoryId?: number;
    filters?: FilterEquipmentDto;
    sort?: SortEquipmentDto[];
}
