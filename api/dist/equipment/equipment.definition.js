"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleDefinition = void 0;
const equipment_module_1 = require("./equipment.module");
const equipment_manifest_1 = require("./equipment.manifest");
const equipment_entities_1 = require("./equipment.entities");
const migrations_1 = require("./database/migrations");
const equipment_seeds_1 = require("./equipment.seeds");
/**
 * Standard backend module contract consumed by the host module runtime.
 * New modules should expose the same named export from their api/definition entry.
 */
exports.moduleDefinition = {
    manifest: equipment_manifest_1.moduleManifest,
    registerAsync: (options) => equipment_module_1.EquipmentModule.registerAsync(options),
    entities: equipment_entities_1.moduleEntities,
    migrations: migrations_1.moduleMigrations,
    seedServices: equipment_seeds_1.moduleSeedServices,
};
