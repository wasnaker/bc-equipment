export declare class FilterEquipmentDto {
    categoryId?: number;
    search?: string;
    isActive?: boolean;
}
export declare class SortEquipmentDto {
    orderBy: 'name' | 'code' | 'createdAt' | 'updatedAt';
    order: 'ASC' | 'DESC';
}
export declare class QueryEquipmentDto {
    page: number;
    limit: number;
    categoryId?: number;
    filters?: FilterEquipmentDto;
    sort?: SortEquipmentDto[];
}
