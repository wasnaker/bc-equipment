export interface ModulePermissionDefinition { name: string; description: string; }
export interface ModuleRoleDefinition { key: string; name: string; description: string; scope: 'global' | 'customer' | 'branch'; permissions: readonly string[]; }
export interface ModuleRoleGrantDefinition {
  targetRole: { moduleId: string; key: string };
  permissions: readonly string[];
}
export interface BackendModuleManifest {
  id: string; version: string; capabilities: readonly ('api' | 'web')[];
  permissions: readonly ModulePermissionDefinition[];
  roles?: readonly ModuleRoleDefinition[];
  roleGrants?: readonly ModuleRoleGrantDefinition[];
  requires?: readonly string[];
  authorizationRequires?: readonly string[];
  requiresServices?: readonly { providerModuleId: string; contractId: string; version: string; }[];
}
export const moduleManifest: BackendModuleManifest = {
  id: 'equipment', version: '0.6.2', capabilities: ['api', 'web'],
  requires: ['customer'],
  authorizationRequires: ['customer'],
  requiresServices: [{
    providerModuleId: 'customer',
    contractId: 'customer.branch-directory',
    version: '^1.0.0',
  }, {
    providerModuleId: 'core',
    contractId: 'core.authorization.registry',
    version: '^1.0.0',
  }],
  permissions: [
    { name: 'read:equipment', description: 'Allows viewing Equipment module navigation and data' },
    { name: 'create:equipment', description: 'Allows creating equipment records' },
    { name: 'update:equipment', description: 'Allows updating equipment records' },
    { name: 'delete:equipment', description: 'Allows deleting equipment records' },
  ],
  // Customer owns the shared Customer and Customer Branch Admin Roles.
  // Equipment owns its permissions and the grants it contributes to those Roles.
  roleGrants: [
    { targetRole: { moduleId: 'customer', key: 'customer' }, permissions: ['read:equipment'] },
    { targetRole: { moduleId: 'customer', key: 'customer-branch-admin' }, permissions: ['read:equipment'] },
  ],
};
export const equipmentModuleManifest = moduleManifest;
