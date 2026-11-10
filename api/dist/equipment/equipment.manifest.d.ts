export interface ModulePermissionDefinition {
    name: string;
    description: string;
}
export interface ModuleRoleDefinition {
    key: string;
    name: string;
    description: string;
    scope: 'global' | 'customer' | 'branch';
    permissions: readonly string[];
}
export interface ModuleRoleGrantDefinition {
    targetRole: {
        moduleId: string;
        key: string;
    };
    permissions: readonly string[];
}
export interface BackendModuleManifest {
    id: string;
    version: string;
    capabilities: readonly ('api' | 'web')[];
    permissions: readonly ModulePermissionDefinition[];
    roles?: readonly ModuleRoleDefinition[];
    roleGrants?: readonly ModuleRoleGrantDefinition[];
    requires?: readonly string[];
    authorizationRequires?: readonly string[];
    requiresServices?: readonly {
        providerModuleId: string;
        contractId: string;
        version: string;
    }[];
}
export declare const moduleManifest: BackendModuleManifest;
export declare const equipmentModuleManifest: BackendModuleManifest;
