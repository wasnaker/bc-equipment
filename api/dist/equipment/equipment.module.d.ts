import { DynamicModule } from '@nestjs/common';
import { EquipmentModuleAsyncOptions } from './equipment.options';
export { EQUIPMENT_MODULE_OPTIONS } from './equipment.options';
export type { EquipmentModuleOptions, EquipmentModuleAsyncOptions } from './equipment.options';
export declare class EquipmentModule {
    static registerAsync(options: EquipmentModuleAsyncOptions): DynamicModule;
}
