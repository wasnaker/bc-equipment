import { CanActivate, ExecutionContext } from '@nestjs/common';
import { EquipmentModuleOptions } from '../equipment.options';
export declare class EquipmentAccessGuard implements CanActivate {
    private readonly options?;
    constructor(options?: EquipmentModuleOptions | undefined);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
