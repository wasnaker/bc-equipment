import { DynamicModule } from '@nestjs/common';
import { RegionModuleAsyncOptions } from './region.options';
export { REGION_MODULE_OPTIONS } from './region.options';
export type { RegionModuleOptions, RegionModuleAsyncOptions } from './region.options';
export declare class RegionModule {
    static registerAsync(options: RegionModuleAsyncOptions): DynamicModule;
}
