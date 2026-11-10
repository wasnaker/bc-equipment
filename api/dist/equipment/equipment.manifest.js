"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipmentModuleManifest = exports.moduleManifest = void 0;
exports.moduleManifest = {
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
exports.equipmentModuleManifest = exports.moduleManifest;
