export declare class Equipment {
    id: number | string;
    ulid: string;
    code: string;
    subgroupId: number | string;
    categoryId: number | string | null;
    name: string;
    description?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
