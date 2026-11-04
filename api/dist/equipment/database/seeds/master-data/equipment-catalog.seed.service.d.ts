import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../infrastructure/persistence/relational/entities/category.entity';
import { EquipmentEntity } from '../../../infrastructure/persistence/relational/entities/equipment.entity';
import { SubgroupEntity } from '../../../infrastructure/persistence/relational/entities/subgroup.entity';
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
export declare class EquipmentCatalogSeedService {
    private readonly subgroupRepository;
    private readonly categoryRepository;
    private readonly equipmentRepository;
    private readonly logger;
    constructor(subgroupRepository: Repository<SubgroupEntity>, categoryRepository: Repository<CategoryEntity>, equipmentRepository: Repository<EquipmentEntity>);
    run(): Promise<void>;
    private loadSubgroupIds;
    private seedCategories;
    private seedEquipments;
    /**
     * Sinkronkan sequence ke MAX(id) agar insert manual (via panel admin)
     * tidak menabrak id eksplisit dari seed. Kode peralatan dibuat trigger
     * `bc_equipment_assign_code` setelah insert.
     */
    private syncSequences;
}
