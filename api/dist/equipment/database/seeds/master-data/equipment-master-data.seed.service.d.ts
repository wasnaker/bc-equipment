import { DataSource } from 'typeorm';
/**
 * Seeds the canonical K3 equipment classification (6 groups, 20 subgroups).
 *
 * Idempotent by natural key. Existing records are retained; only missing
 * classification metadata is filled, so repeated host seed runs do not
 * overwrite user-maintained names, descriptions, status, or custom ordering.
 */
export declare class EquipmentMasterDataSeedService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    run(): Promise<void>;
}
