import type { DynamicModule } from '@nestjs/common';
import type { RegionModuleAsyncOptions } from './region.options';
/**
 * Standard backend module contract consumed by the host module runtime.
 * New modules should expose the same named export from their api/definition entry.
 */
export declare const moduleDefinition: {
    manifest: import("./region.manifest").BackendModuleManifest;
    registerAsync: (options: RegionModuleAsyncOptions) => DynamicModule;
    entities: readonly [typeof import("./region.entities").ProvinceEntity, typeof import("./region.entities").RegencyEntity];
    migrations: readonly [typeof import("./database/migrations").CreateRegion1793466257948612617, typeof import("./database/migrations").AddRegionUniquenessConstraints1793466257948612618, typeof import("./database/migrations").AddRegencyCode1793710213000000000];
    seedServices: readonly [typeof import("..").RegionSeedService];
};
