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

export interface BackendModuleManifest {
  id: string;
  version: string;
  capabilities: readonly ('api' | 'web')[];
  permissions: readonly ModulePermissionDefinition[];
  roles?: readonly ModuleRoleDefinition[];
}

export const moduleManifest: BackendModuleManifest = {
  id: 'equipment',
  version: '0.6.0',
  capabilities: ['api', 'web'],
  permissions: [
    { name: 'read:equipment', description: 'Allows viewing Equipment module navigation and data' },
    { name: 'create:equipment', description: 'Allows creating equipment records' },
    { name: 'update:equipment', description: 'Allows updating equipment records' },
    { name: 'delete:equipment', description: 'Allows deleting equipment records' },
  ],
  // Module-owned defaults are appended to the centrally managed Customer role
  // by the host seeder; each module grants only the access it owns.
  roles: [
    {
      key: 'customer',
      name: 'Customer',
      description: 'Standard customer staff account; read access to equipment reference data.',
      scope: 'branch',
      permissions: ['read:equipment'],
    },
  ],
};

export const equipmentModuleManifest = moduleManifest;
