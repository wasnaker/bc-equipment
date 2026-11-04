"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EquipmentCatalogSeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentCatalogSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../../../infrastructure/persistence/relational/entities/category.entity");
const equipment_entity_1 = require("../../../infrastructure/persistence/relational/entities/equipment.entity");
const subgroup_entity_1 = require("../../../infrastructure/persistence/relational/entities/subgroup.entity");
const categories_data_1 = require("../seed-data/categories.data");
const equipments_data_1 = require("../seed-data/equipments.data");
/**
 * Seed katalog kategori & peralatan K3.
 *
 * Sumber data: wasnaker/prfx-equipments `CategoriesSeeder.php` (15 kategori)
 * dan `EquipmentsSeeder.php` (91 peralatan). Hanya datanya yang diimpor —
 * tidak ada kode PHP yang diporting.
 *
 * IDEMPOTENT & DETERMINISTIK:
 * - Setiap baris seed membawa `id` eksplisit (kategori 1..15, equipment 1..91)
 *   dan ULID turunan nomor urut, sehingga id/kode peralatan sama di semua
 *   environment. `equipment.code` tetap dibuat trigger setelah insert.
 * - Kategori cocok by `(subgroupId, name)`; peralatan cocok by subgroup,
 *   optional category, dan nama.
 *   Baris yang sudah ada tidak ditimpa (data buatan pengguna dipertahankan).
 * - Bila `id` seed ternyata sudah dipakai baris lain (mis. DB lama), baris
 *   baru dimasukkan tanpa id eksplisit dan urutan sequence tetap disinkronkan
 *   ke MAX(id) di akhir.
 * - Aman dijalankan berulang; tidak membuat duplikat.
 */
let EquipmentCatalogSeedService = EquipmentCatalogSeedService_1 = class EquipmentCatalogSeedService {
    constructor(subgroupRepository, categoryRepository, equipmentRepository) {
        this.subgroupRepository = subgroupRepository;
        this.categoryRepository = categoryRepository;
        this.equipmentRepository = equipmentRepository;
        this.logger = new common_1.Logger(EquipmentCatalogSeedService_1.name);
    }
    async run() {
        const subgroupIdByName = await this.loadSubgroupIds();
        if (subgroupIdByName.size === 0) {
            this.logger.warn('Katalog peralatan dilewati: tabel equipment_subgroup masih kosong');
            return;
        }
        await this.seedCategories(subgroupIdByName);
        await this.seedEquipments(subgroupIdByName);
        await this.syncSequences();
    }
    async loadSubgroupIds() {
        const subgroups = await this.subgroupRepository.find({
            select: ['id', 'name'],
        });
        return new Map(subgroups.map((row) => [row.name, Number(row.id)]));
    }
    async seedCategories(subgroupIdByName) {
        const existing = await this.categoryRepository.find({
            select: ['id', 'subgroupId', 'name'],
        });
        const existingKeys = new Set(existing.map((row) => `${row.subgroupId}:${row.name}`));
        const usedIds = new Set(existing.map((row) => Number(row.id)));
        const toInsert = [];
        const missingSubgroups = new Set();
        for (const row of categories_data_1.CATEGORY_SEED) {
            const subgroupId = subgroupIdByName.get(row.subgroupName);
            if (!subgroupId) {
                missingSubgroups.add(row.subgroupName);
                continue;
            }
            const key = `${subgroupId}:${row.name}`;
            if (existingKeys.has(key))
                continue;
            const explicitId = usedIds.has(row.id) ? undefined : row.id;
            if (explicitId == null) {
                this.logger.warn(`Kategori "${row.name}" memakai id otomatis: id seed ${row.id} sudah dipakai baris lain`);
            }
            else {
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
            this.logger.warn(`Kategori dilewati, subkelompok tidak ditemukan: ${[
                ...missingSubgroups,
            ].join(', ')}`);
        }
        this.logger.log(`Kategori seed: ${toInsert.length} dibuat, ${existing.length} sudah ada`);
    }
    async seedEquipments(subgroupIdByName) {
        // Peta kategori dibaca ulang agar mencakup baris yang baru dibuat.
        const categories = await this.categoryRepository.find({
            select: ['id', 'subgroupId', 'name'],
        });
        const categoryIdByKey = new Map(categories.map((row) => [
            `${row.subgroupId}:${row.name}`,
            Number(row.id),
        ]));
        const existing = await this.equipmentRepository.find({
            select: ['id', 'subgroupId', 'categoryId', 'name'],
        });
        const existingByKey = new Set(existing.map((row) => `${row.subgroupId}:${row.categoryId ?? 'null'}:${row.name.trim().toLowerCase()}`));
        const usedIds = new Set(existing.map((row) => Number(row.id)));
        const toInsert = [];
        const skipped = [];
        for (const row of equipments_data_1.EQUIPMENT_SEED) {
            const subgroupId = subgroupIdByName.get(row.subgroupName);
            if (!subgroupId) {
                skipped.push(`${row.subgroupName}/${row.name}`);
                continue;
            }
            const categoryId = row.categoryName
                ? categoryIdByKey.get(`${subgroupId}:${row.categoryName}`) ?? null
                : null;
            if (row.categoryName && categoryId == null) {
                skipped.push(`${row.subgroupName}/${row.categoryName}/${row.name}`);
                continue;
            }
            const key = `${subgroupId}:${categoryId ?? 'null'}:${row.name.trim().toLowerCase()}`;
            if (existingByKey.has(key))
                continue;
            const explicitId = usedIds.has(row.id) ? undefined : row.id;
            if (explicitId == null) {
                this.logger.warn(`Peralatan "${row.name}" memakai id otomatis: id seed ${row.id} sudah dipakai baris lain`);
            }
            else {
                usedIds.add(explicitId);
            }
            toInsert.push({
                ...(explicitId == null ? {} : { id: BigInt(explicitId) }),
                ulid: row.ulid,
                subgroupId,
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
            this.logger.warn(`Peralatan dilewati karena subgroup atau kategori tidak ditemukan: ${skipped.join(', ')}`);
        }
        this.logger.log(`Peralatan seed: ${toInsert.length} dibuat, ${existing.length} sudah ada`);
    }
    /**
     * Sinkronkan sequence ke MAX(id) agar insert manual (via panel admin)
     * tidak menabrak id eksplisit dari seed. Kode peralatan dibuat trigger
     * `bc_equipment_assign_code` setelah insert.
     */
    async syncSequences() {
        for (const table of ['equipment_category', 'equipment']) {
            await this.equipmentRepository.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM "${table}"), 1))`);
        }
    }
};
exports.EquipmentCatalogSeedService = EquipmentCatalogSeedService;
exports.EquipmentCatalogSeedService = EquipmentCatalogSeedService = EquipmentCatalogSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subgroup_entity_1.SubgroupEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(equipment_entity_1.EquipmentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EquipmentCatalogSeedService);
