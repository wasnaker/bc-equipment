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
  version: '0.4.0',
  capabilities: ['api', 'web'],
  permissions: [
    { name: 'read:equipment', description: 'Allows viewing Equipment module navigation and data' },
    { name: 'create:equipment', description: 'Allows creating provinces and regencies' },
    { name: 'update:equipment', description: 'Allows updating provinces and regencies' },
    { name: 'delete:equipment', description: 'Allows deleting provinces and regencies' },
  ],
};

export const equipmentModuleManifest = moduleManifest;
