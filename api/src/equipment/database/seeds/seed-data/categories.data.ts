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

export const CATEGORY_SEED: CategorySeedRow[] = [
  { id: 1, subgroupName: 'Pesawat Angkat', name: 'Crane', description: null },
  { id: 2, subgroupName: 'Pesawat Angkat', name: 'Hoist', description: null },
  { id: 3, subgroupName: 'Pesawat Angkat', name: 'Gondola', description: null },
  { id: 4, subgroupName: 'Pesawat Angkut', name: 'Fork', description: null },
  { id: 5, subgroupName: 'Pesawat Angkut', name: 'Gudang Tinggi', description: null },
  { id: 6, subgroupName: 'Pesawat Angkut', name: 'Scissor/AWP', description: null },
  { id: 7, subgroupName: 'Pesawat Uap', name: 'Fire Tube Boiler', description: null },
  { id: 8, subgroupName: 'Pesawat Uap', name: 'Water Tube Boiler', description: null },
  { id: 9, subgroupName: 'Pesawat Uap', name: 'Shell & Tube HX', description: null },
  { id: 10, subgroupName: 'Bejana Bertekanan', name: 'Pressure Vessel', description: null },
  { id: 11, subgroupName: 'Bejana Bertekanan', name: 'Heat Exchanger', description: null },
  { id: 12, subgroupName: 'Bejana Bertekanan', name: 'Autoclave', description: null },
  { id: 13, subgroupName: 'Tangki Timbun', name: 'Flammable Tank', description: null },
  { id: 14, subgroupName: 'Tangki Timbun', name: 'Chemical Tank', description: null },
  { id: 15, subgroupName: 'Tangki Timbun', name: 'Water Tank', description: null },
  { id: 16, subgroupName: 'Pesawat Angkut', name: 'Umum', description: null },
  { id: 17, subgroupName: 'Penggerak Mula', name: 'Umum', description: null },
  { id: 18, subgroupName: 'Mesin Perkakas', name: 'Umum', description: null },
  { id: 19, subgroupName: 'Mesin Produksi', name: 'Umum', description: null },
  { id: 20, subgroupName: 'Transmisi Tenaga Mekanik', name: 'Umum', description: null },
  { id: 21, subgroupName: 'Tanur', name: 'Umum', description: null },
  { id: 22, subgroupName: 'Turbin', name: 'Umum', description: null },
  { id: 23, subgroupName: 'Kincir Angin', name: 'Umum', description: null },
  { id: 24, subgroupName: 'Motor Listrik', name: 'Umum', description: null },
  { id: 25, subgroupName: 'APAR', name: 'Umum', description: null },
  { id: 26, subgroupName: 'Instalasi Hydrant', name: 'Umum', description: null },
  { id: 27, subgroupName: 'Fire Alarm', name: 'Umum', description: null },
  { id: 28, subgroupName: 'Instalasi Listrik', name: 'Umum', description: null },
  { id: 29, subgroupName: 'Penyalur Petir', name: 'Umum', description: null },
  { id: 30, subgroupName: 'Lift', name: 'Umum', description: null },
  { id: 31, subgroupName: 'Eskalator', name: 'Umum', description: null },
];
