"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleDefinition = void 0;
const region_module_1 = require("./region.module");
const region_manifest_1 = require("./region.manifest");
const region_entities_1 = require("./region.entities");
const migrations_1 = require("./database/migrations");
const region_seeds_1 = require("./region.seeds");
/**
 * Standard backend module contract consumed by the host module runtime.
 * New modules should expose the same named export from their api/definition entry.
 */
exports.moduleDefinition = {
    manifest: region_manifest_1.moduleManifest,
    registerAsync: (options) => region_module_1.RegionModule.registerAsync(options),
    entities: region_entities_1.moduleEntities,
    migrations: migrations_1.moduleMigrations,
    seedServices: region_seeds_1.moduleSeedServices,
};
