import { Subgroup } from '../domain/subgroup';
export declare class CreateSubgroupDto {
    groupId: Subgroup['groupId'];
    name: string;
    description?: string | null;
    isActive?: boolean;
}
