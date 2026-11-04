import { CreateGroupDto } from './create-group.dto';
declare const UpdateGroupDto_base: import("@nestjs/common").Type<Partial<CreateGroupDto>>;
export declare class UpdateGroupDto extends UpdateGroupDto_base {
    isActive?: boolean;
}
export {};
