import type { DynamicModule } from '@nestjs/common';
export interface EquipmentModuleOptions {
    /** Delegate permission decisions to the host's authorization service. */
    authorize: (roleId: number | string, permission: string) => boolean | Promise<boolean>;
}
export interface EquipmentModuleAsyncOptions {
    imports?: DynamicModule['imports'];
    inject?: any[];
    useFactory: (...dependencies: any[]) => EquipmentModuleOptions | Promise<EquipmentModuleOptions>;
}
export declare const EQUIPMENT_MODULE_OPTIONS: unique symbol;
