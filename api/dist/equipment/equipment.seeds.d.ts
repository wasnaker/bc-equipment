import { EquipmentMasterDataSeedService } from './database/seeds/master-data/equipment-master-data.seed.service';
import { EquipmentCatalogSeedService } from './database/seeds/master-data/equipment-catalog.seed.service';
/**
 * K3 equipment master data.
 * - `EquipmentMasterDataSeedService`: group + subgroup (SubgroupsSeeder).
 * - `EquipmentCatalogSeedService`: category + equipment (CategoriesSeeder,
 *   EquipmentsSeeder).
 * Seeded by the host relational seed lifecycle; safe to run repeatedly.
 */
export declare const moduleSeedServices: readonly [typeof EquipmentMasterDataSeedService, typeof EquipmentCatalogSeedService];
