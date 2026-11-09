export interface ModulePermissionDefinition { name: string; description: string; }
export interface ModuleRoleDefinition { key: string; name: string; description: string; scope: 'global' | 'customer' | 'branch'; permissions: readonly string[]; }
export interface BackendModuleManifest { id: string; version: string; capabilities: readonly ('api' | 'web')[]; permissions: readonly ModulePermissionDefinition[]; roles?: readonly ModuleRoleDefinition[]; requires?: readonly string[]; requiresServices?: readonly { providerModuleId: string; contractId: string; version: string; }[]; }
export const moduleManifest: BackendModuleManifest = {
  id: 'equipment', version: '0.6.1', capabilities: ['api', 'web'],
  requires: ['customer'],
  requiresServices: [
    {
      providerModuleId: 'customer',
      contractId: 'customer.branch-directory',
      version: '^1.0.0',
    },
  ],
  permissions: [
    { name: 'read:equipment', description: 'Allows viewing Equipment module navigation and data' },
    { name: 'create:equipment', description: 'Allows creating equipment records' },
    { name: 'update:equipment', description: 'Allows updating equipment records' },
    { name: 'delete:equipment', description: 'Allows deleting equipment records' },
  ],
  roles: [
    { key: 'customer', name: 'Customer', description: 'Standard customer staff account; read access to equipment reference data.', scope: 'branch', permissions: ['read:equipment'] },
    { key: 'customer-branch-admin', name: 'Customer Branch Admin', description: 'Branch administrator; read access to equipment reference data.', scope: 'branch', permissions: ['read:equipment'] },
  ],
};
export const equipmentModuleManifest = moduleManifest;
