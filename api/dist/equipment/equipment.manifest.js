"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipmentModuleManifest = exports.moduleManifest = void 0;
exports.moduleManifest = {
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
exports.equipmentModuleManifest = exports.moduleManifest;
