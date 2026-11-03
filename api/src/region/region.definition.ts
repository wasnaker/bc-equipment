import type { DynamicModule } from '@nestjs/common';
import { RegionModule } from './region.module';
import { moduleManifest } from './region.manifest';
import { moduleEntities } from './region.entities';
import { moduleMigrations } from './database/migrations';
import { moduleSeedServices } from './region.seeds';
import type { RegionModuleAsyncOptions } from './region.options';

/**
 * Standard backend module contract consumed by the host module runtime.
 * New modules should expose the same named export from their api/definition entry.
 */
export const moduleDefinition = {
  manifest: moduleManifest,
  registerAsync: (options: RegionModuleAsyncOptions): DynamicModule =>
    RegionModule.registerAsync(options),
  entities: moduleEntities,
  migrations: moduleMigrations,
  seedServices: moduleSeedServices,
};
