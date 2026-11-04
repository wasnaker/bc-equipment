/**
 * Katalog kategori peralatan K3 (sumber data: wasnaker/prfx-equipments
 * database/seeds/CategoriesSeeder.php).
 *
 * `id` eksplisit agar urutan & id sama di semua environment (aman dijadikan
 * referensi FK oleh seed lain). Kategori "Umum" adalah adaptasi skema: data
 * sumber menaruh sebagian peralatan langsung di bawah subkelompok tanpa
 * kategori, sedangkan `equipment.categoryId` wajib terisi.
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
