import type { DynamicModule } from '@nestjs/common';
export interface ModuleAuthorizationScope {
    type: string;
    id: string;
}
export interface ModuleAuthorizationTarget {
    scopes: readonly ModuleAuthorizationScope[];
}
export interface ModuleResolvedScopes {
    global: boolean;
    scopes: readonly ModuleAuthorizationScope[];
}
export interface EquipmentModuleOptions {
    /** Delegate permission decisions to the host's authorization service. */
    authorize: (roleId: number | string, permission: string) => boolean | Promise<boolean>;
    /** Optional universal scope evaluator supplied by Brocoders Authorization Core. */
    authorizeScoped?: (userId: number | string, permission: string, target: ModuleAuthorizationTarget) => boolean | Promise<boolean>;
    /** Optional authorized scopes for backend filtering before pagination/count. */
    resolveScopes?: (userId: number | string, permission: string) => ModuleResolvedScopes | Promise<ModuleResolvedScopes>;
}
export interface EquipmentModuleAsyncOptions {
    imports?: DynamicModule['imports'];
    inject?: any[];
    useFactory: (...dependencies: any[]) => EquipmentModuleOptions | Promise<EquipmentModuleOptions>;
}
export declare const EQUIPMENT_MODULE_OPTIONS: unique symbol;
