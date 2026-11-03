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
  id: 'region',
  version: '0.4.0',
  capabilities: ['api', 'web'],
  permissions: [
    { name: 'read:region', description: 'Allows viewing Region module navigation and data' },
    { name: 'create:region', description: 'Allows creating provinces and regencies' },
    { name: 'update:region', description: 'Allows updating provinces and regencies' },
    { name: 'delete:region', description: 'Allows deleting provinces and regencies' },
  ],
};

export const regionModuleManifest = moduleManifest;
