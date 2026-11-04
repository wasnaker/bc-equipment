/**
 * Katalog kategori peralatan K3 (sumber data: wasnaker/prfx-equipments
 * database/seeds/CategoriesSeeder.php).
 *
 * `id` eksplisit agar urutan & id sama di semua environment (aman dijadikan
 * referensi FK oleh seed lain). Hanya 15 kategori yang benar-benar tersedia
 * pada sumber PRFX yang diimpor; equipment tanpa kategori tetap di subgroup.
 *
 * Entity `equipment_category` tidak memiliki kolom `code`/`sort_order` milik
 * sumber, jadi kedua field itu tidak ikut diimpor. Upsert memakai natural key
 * (subgroupId, name).
 */
export interface CategorySeedRow {
    id: number;
    subgroupName: string;
    name: string;
    description: string | null;
}
export declare const CATEGORY_SEED: CategorySeedRow[];
