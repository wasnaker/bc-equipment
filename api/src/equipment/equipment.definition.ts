import type { DynamicModule } from '@nestjs/common';
import { EquipmentModule } from './equipment.module';
import { moduleManifest } from './equipment.manifest';
import { moduleEntities } from './equipment.entities';
import { moduleMigrations } from './database/migrations';
import { moduleSeedServices } from './equipment.seeds';
import type { EquipmentModuleAsyncOptions } from './equipment.options';

/**
 * Standard backend module contract consumed by the host module runtime.
 * New modules should expose the same named export from their api/definition entry.
 */
export const moduleDefinition = {
  manifest: moduleManifest,
  registerAsync: (options: EquipmentModuleAsyncOptions): DynamicModule =>
    EquipmentModule.registerAsync(options),
  entities: moduleEntities,
  migrations: moduleMigrations,
  seedServices: moduleSeedServices,
};
