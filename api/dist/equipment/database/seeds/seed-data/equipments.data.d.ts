/**
 * Katalog peralatan K3 (sumber data: wasnaker/prfx-equipments
 * database/seeds/EquipmentsSeeder.php).
 *
 * `id` eksplisit agar urutan & kode peralatan (dibuat trigger
 * `bc_equipment_assign_code`) deterministik. `ulid` dihitung dari timestamp
 * tetap + nomor urut sehingga stabil di semua environment.
 *
 * Data sumber hanya menyediakan `long_description` (dokumentasi panjang);
 * kolom `description` di sini diisi paragraf pertama yang dipadatkan dan
 * dipotong maksimal 500 karakter (batas kolom). Peralatan tanpa deskripsi
 * panjang dibiarkan NULL. Field `description` menjadi nama peralatan dan
 * `categoryName` nullable: null berarti sumber PRFX tidak menetapkan kategori.
 */
export interface EquipmentSeedRow {
    id: number;
    ulid: string;
    subgroupName: string;
    categoryName: string | null;
    name: string;
    description: string | null;
}
export declare const EQUIPMENT_SEED: EquipmentSeedRow[];
