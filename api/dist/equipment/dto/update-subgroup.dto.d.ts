import { CreateSubgroupDto } from './create-subgroup.dto';
import { Subgroup } from '../domain/subgroup';
declare const UpdateSubgroupDto_base: import("@nestjs/common").Type<Partial<CreateSubgroupDto>>;
export declare class UpdateSubgroupDto extends UpdateSubgroupDto_base {
    groupId?: Subgroup['groupId'];
    isActive?: boolean;
}
export {};
