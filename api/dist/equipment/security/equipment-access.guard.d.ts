import { CanActivate, ExecutionContext } from '@nestjs/common';
import { EquipmentModuleOptions } from '../equipment.options';
import { CustomerBranchDirectoryClient } from '../customer-branch-directory.client';
export declare class EquipmentAccessGuard implements CanActivate {
    private readonly options?;
    private readonly customerBranches?;
    constructor(options?: EquipmentModuleOptions | undefined, customerBranches?: CustomerBranchDirectoryClient | undefined);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
