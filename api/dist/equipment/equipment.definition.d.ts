import type { DynamicModule } from '@nestjs/common';
import type { EquipmentModuleAsyncOptions } from './equipment.options';
/**
 * Standard backend module contract consumed by the host module runtime.
 * New modules should expose the same named export from their api/definition entry.
 */
export declare const moduleDefinition: {
    manifest: import("./equipment.manifest").BackendModuleManifest;
    registerAsync: (options: EquipmentModuleAsyncOptions) => DynamicModule;
    entities: readonly [typeof import("./equipment.entities").GroupEntity, typeof import("./equipment.entities").SubgroupEntity, typeof import("./equipment.entities").CategoryEntity, typeof import("./equipment.entities").EquipmentEntity];
    migrations: readonly [typeof import("./database/migrations").CreateEquipmentHierarchy1793710214000000001, typeof import("./database/migrations").CreateEquipmentCategory1793710215000000000, typeof import("./database/migrations").CreateEquipmentMaster1793710216000000000, typeof import("./database/migrations").AddEquipmentClassificationMetadata1793710217000000000];
    seedServices: readonly [typeof import("./database/seeds/master-data/equipment-master-data.seed.service").EquipmentMasterDataSeedService];
};
