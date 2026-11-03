import { CanActivate, ExecutionContext } from '@nestjs/common';
import { RegionModuleOptions } from '../region.options';
export declare class RegionAccessGuard implements CanActivate {
    private readonly options?;
    constructor(options?: RegionModuleOptions | undefined);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
