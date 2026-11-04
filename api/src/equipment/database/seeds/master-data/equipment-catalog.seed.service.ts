import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryEntity } from '../../../infrastructure/persistence/relational/entities/category.entity';
import { EquipmentEntity } from '../../../infrastructure/persistence/relational/entities/equipment.entity';
import { SubgroupEntity } from '../../../infrastructure/persistence/relational/entities/subgroup.entity';

import {
  CATEGORY_SEED,
  CategorySeedRow,
} from '../seed-data/categories.data';
import {
  EQUIPMENT_SEED,
  EquipmentSeedRow,
} from '../seed-data/equipments.data';

interface CategoryInsert {
  id?: number;
  subgroupId: number;
  name: string;
  description: string | null;
}

interface EquipmentInsert {
  id?: bigint;
  ulid: string;
  categoryId: number;
  name: string;
  description: string | null;
}

/**
 * Seed katalog kategori & peralatan K3.
 *
 * Sumber data: wasnaker/prfx-equipments `CategoriesSeeder.php` (15 kategori)
 * dan `EquipmentsSeeder.php` (91 peralatan). Hanya datanya yang diimpor —
 * tidak ada kode PHP yang diporting.
 *
 * IDEMPOTENT & DETERMINISTIK:
 * - Setiap baris seed membawa `id` eksplisit (kategori 1..31, equipment 1..91)
 *   dan ULID turunan nomor urut, sehingga id/kode peralatan sama di semua
 *   environment. `equipment.code` tetap dibuat trigger setelah insert.
 * - Kategori cocok by `(subgroupId, name)`; peralatan cocok by
 *   `(categoryId, lower(btrim(name)))` — sesuai unique index yang ada.
 *   Baris yang sudah ada tidak ditimpa (data buatan pengguna dipertahankan).
 * - Bila `id` seed ternyata sudah dipakai baris lain (mis. DB lama), baris
 *   baru dimasukkan tanpa id eksplisit dan urutan sequence tetap disinkronkan
 *   ke MAX(id) di akhir.
 * - Aman dijalankan berulang; tidak membuat duplikat.
 */
@Injectable()
export class EquipmentCatalogSeedService {
  private readonly logger = new Logger(EquipmentCatalogSeedService.name);

  constructor(
    @InjectRepository(SubgroupEntity)
    private readonly subgroupRepository: Repository<SubgroupEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(EquipmentEntity)
    private readonly equipmentRepository: Repository<EquipmentEntity>,
  ) {}

  async run(): Promise<void> {
    const subgroupIdByName = await this.loadSubgroupIds();
    if (subgroupIdByName.size === 0) {
      this.logger.warn(
        'Katalog peralatan dilewati: tabel equipment_subgroup masih kosong',
      );
      return;
    }

    await this.seedCategories(subgroupIdByName);
    await this.seedEquipments(subgroupIdByName);
    await this.syncSequences();
  }

  private async loadSubgroupIds(): Promise<Map<string, number>> {
    const subgroups = await this.subgroupRepository.find({
      select: ['id', 'name'],
    });
    return new Map(subgroups.map((row) => [row.name, Number(row.id)]));
  }

  private async seedCategories(
    subgroupIdByName: Map<string, number>,
  ): Promise<void> {
    const existing = await this.categoryRepository.find({
      select: ['id', 'subgroupId', 'name'],
    });
    const existingKeys = new Set(
      existing.map((row) => `${row.subgroupId}:${row.name}`),
    );
    const usedIds = new Set(existing.map((row) => Number(row.id)));
    const toInsert: CategoryInsert[] = [];
    const missingSubgroups = new Set<string>();

    for (const row of CATEGORY_SEED as CategorySeedRow[]) {
      const subgroupId = subgroupIdByName.get(row.subgroupName);
      if (!subgroupId) {
        missingSubgroups.add(row.subgroupName);
        continue;
      }
      const key = `${subgroupId}:${row.name}`;
      if (existingKeys.has(key)) continue;

      const explicitId = usedIds.has(row.id) ? undefined : row.id;
      if (explicitId == null) {
        this.logger.warn(
          `Kategori "${row.name}" memakai id otomatis: id seed ${row.id} sudah dipakai baris lain`,
        );
      } else {
        usedIds.add(explicitId);
      }

      toInsert.push({
        ...(explicitId == null ? {} : { id: explicitId }),
        subgroupId,
        name: row.name,
        description: row.description,
      });
      // Tandai key agar nilai seed ganda tidak masuk dua kali.
      existingKeys.add(key);
    }

    for (let i = 0; i < toInsert.length; i += 200) {
      await this.categoryRepository.insert(toInsert.slice(i, i + 200));
    }

    if (missingSubgroups.size > 0) {
      this.logger.warn(
        `Kategori dilewati, subkelompok tidak ditemukan: ${[
          ...missingSubgroups,
        ].join(', ')}`,
      );
    }

    this.logger.log(
      `Kategori seed: ${toInsert.length} dibuat, ${existing.length} sudah ada`,
    );
  }

  private async seedEquipments(
    subgroupIdByName: Map<string, number>,
  ): Promise<void> {
    // Peta kategori dibaca ulang agar mencakup baris yang baru dibuat.
    const categories = await this.categoryRepository.find({
      select: ['id', 'subgroupId', 'name'],
    });
    const categoryIdByKey = new Map(
      categories.map((row) => [
        `${row.subgroupId}:${row.name}`,
        Number(row.id),
      ]),
    );

    const existing = await this.equipmentRepository.find({
      select: ['id', 'categoryId', 'name'],
    });
    const existingByKey = new Set(
      existing.map(
        (row) => `${row.categoryId}:${row.name.trim().toLowerCase()}`,
      ),
    );
    const usedIds = new Set(existing.map((row) => Number(row.id)));
    const toInsert: EquipmentInsert[] = [];
    const skipped: string[] = [];

    for (const row of EQUIPMENT_SEED as EquipmentSeedRow[]) {
      const subgroupId = subgroupIdByName.get(row.subgroupName);
      const categoryId = subgroupId
        ? categoryIdByKey.get(`${subgroupId}:${row.categoryName}`)
        : undefined;
      if (!categoryId) {
        skipped.push(`${row.subgroupName}/${row.categoryName}/${row.name}`);
        continue;
      }

      const key = `${categoryId}:${row.name.trim().toLowerCase()}`;
      if (existingByKey.has(key)) continue;

      const explicitId = usedIds.has(row.id) ? undefined : row.id;
      if (explicitId == null) {
        this.logger.warn(
          `Peralatan "${row.name}" memakai id otomatis: id seed ${row.id} sudah dipakai baris lain`,
        );
      } else {
        usedIds.add(explicitId);
      }

      toInsert.push({
        ...(explicitId == null ? {} : { id: BigInt(explicitId) }),
        ulid: row.ulid,
        categoryId,
        name: row.name,
        description: row.description,
      });
      existingByKey.add(key);
    }

    for (let i = 0; i < toInsert.length; i += 200) {
      await this.equipmentRepository.insert(toInsert.slice(i, i + 200));
    }

    if (skipped.length > 0) {
      this.logger.warn(
        `Peralatan dilewati karena kategori tidak ditemukan: ${skipped.join(', ')}`,
      );
    }

    this.logger.log(
      `Peralatan seed: ${toInsert.length} dibuat, ${existing.length} sudah ada`,
    );
  }

  /**
   * Sinkronkan sequence ke MAX(id) agar insert manual (via panel admin)
   * tidak menabrak id eksplisit dari seed. Kode peralatan dibuat trigger
   * `bc_equipment_assign_code` setelah insert.
   */
  private async syncSequences(): Promise<void> {
    for (const table of ['equipment_category', 'equipment']) {
      await this.equipmentRepository.query(
        `SELECT setval(pg_get_serial_sequence('${table}', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM "${table}"), 1))`,
      );
    }
  }
}
