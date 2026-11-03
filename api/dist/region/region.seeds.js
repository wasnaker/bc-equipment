"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleSeedServices = void 0;
const region_seed_service_1 = require("./database/region-seed.service");
/** Seed providers owned by this module and executed by the host seed lifecycle. */
exports.moduleSeedServices = [region_seed_service_1.RegionSeedService];
