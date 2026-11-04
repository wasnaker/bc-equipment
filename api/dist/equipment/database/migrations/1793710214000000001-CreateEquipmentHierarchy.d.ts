import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Membuat tabel milik modul equipment sendiri: equipment_group dan
 * equipment_subgroup.
 *
 * PENTING: modul ini TIDAK BOLEH menyentuh tabel `province`/`regency`
 * milik modul region. Versi lama dari modul ini (hasil clone template
 * region) sempat me-rename tabel region menjadi tabel equipment — migrasi
 * tersebut sudah dihapus karena akan menghancurkan data region dan FK
 * milik modul lain (mis. branch.provinceId).
 */
export declare class CreateEquipmentHierarchy1793710214000000001 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
