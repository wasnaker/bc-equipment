import { RegionSeedService } from './database/region-seed.service';

/** Seed providers owned by this module and executed by the host seed lifecycle. */
export const moduleSeedServices = [RegionSeedService] as const;
