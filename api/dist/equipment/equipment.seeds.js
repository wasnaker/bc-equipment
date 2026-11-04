"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleSeedServices = void 0;
const equipment_master_data_seed_service_1 = require("./database/seeds/master-data/equipment-master-data.seed.service");
/**
 * K3 equipment classification master data.
 * Seeded by the host relational seed lifecycle; safe to run repeatedly.
 */
exports.moduleSeedServices = [equipment_master_data_seed_service_1.EquipmentMasterDataSeedService];
