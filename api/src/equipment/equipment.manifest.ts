export interface ModulePermissionDefinition {
  name: string;
  description: string;
}

export interface BackendModuleManifest {
  id: string;
  version: string;
  capabilities: readonly ('api' | 'web')[];
  permissions: readonly ModulePermissionDefinition[];
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
};

export const equipmentModuleManifest = moduleManifest;
