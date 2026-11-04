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
export class CreateEquipmentHierarchy1793710214000000001
  implements MigrationInterface
{
  name = 'CreateEquipmentHierarchy1793710214000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "equipment_group" (
        "id" SERIAL NOT NULL,
        "name" character varying(190) NOT NULL,
        "description" character varying(500),
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_equipment_group_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_equipment_group_name"
      ON "equipment_group" ("name")
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "equipment_subgroup" (
        "id" SERIAL NOT NULL,
        "groupId" integer NOT NULL,
        "name" character varying(190) NOT NULL,
        "description" character varying(500),
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_equipment_subgroup_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_equipment_subgroup_group" FOREIGN KEY ("groupId")
          REFERENCES "equipment_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_equipment_subgroup_group_name"
      ON "equipment_subgroup" ("groupId", "name")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_equipment_subgroup_groupId"
      ON "equipment_subgroup" ("groupId")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_equipment_subgroup_name"
      ON "equipment_subgroup" ("name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS "IDX_equipment_subgroup_name"',
    );
    await queryRunner.query(
      'DROP INDEX IF EXISTS "IDX_equipment_subgroup_groupId"',
    );
    await queryRunner.query(
      'DROP INDEX IF EXISTS "UQ_equipment_subgroup_group_name"',
    );
    await queryRunner.query('DROP TABLE IF EXISTS "equipment_subgroup"');
    await queryRunner.query(
      'DROP INDEX IF EXISTS "UQ_equipment_group_name"',
    );
    await queryRunner.query('DROP TABLE IF EXISTS "equipment_group"');
  }
}
