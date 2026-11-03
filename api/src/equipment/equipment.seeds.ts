import { EquipmentSeedService } from './database/equipment-seed.service';

/** Seed providers owned by this module and executed by the host seed lifecycle. */
export const moduleSeedServices = [EquipmentSeedService] as const;
