import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EQUIPMENT_MASTER_DATA_SQL } from './equipment-master-data.sql';

/**
 * Seeds the canonical K3 equipment classification (6 groups, 20 subgroups).
 *
 * Idempotent by natural key. Existing records are retained; only missing
 * classification metadata is filled, so repeated host seed runs do not
 * overwrite user-maintained names, descriptions, status, or custom ordering.
 */
@Injectable()
export class EquipmentMasterDataSeedService {
  constructor(
    @Inject(DataSource)
    private readonly dataSource: DataSource,
  ) {}

  async run(): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.query(EQUIPMENT_MASTER_DATA_SQL);
    });
  }
}
