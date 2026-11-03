"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionModuleManifest = exports.moduleManifest = void 0;
exports.moduleManifest = {
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
exports.regionModuleManifest = exports.moduleManifest;
