import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Convert the legacy Province/Regency hierarchy into generic Equipment Groups.
 * Existing row IDs and legacy columns are retained; no region data is deleted.
 */
export class ConvertProvinceRegencyToEquipmentGroups1793710214000000000
  implements MigrationInterface
{
  name = 'ConvertProvinceRegencyToEquipmentGroups1793710214000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF to_regclass('public.province') IS NOT NULL
           AND to_regclass('public.equipment_group') IS NULL THEN
          ALTER TABLE "province" RENAME TO "equipment_group";
        ELSIF to_regclass('public.province') IS NOT NULL
           AND to_regclass('public.equipment_group') IS NOT NULL THEN
          RAISE EXCEPTION 'Both province and equipment_group tables exist; refusing an ambiguous data migration';
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF to_regclass('public.regency') IS NOT NULL
           AND to_regclass('public.equipment_subgroup') IS NULL THEN
          ALTER TABLE "regency" RENAME TO "equipment_subgroup";
        ELSIF to_regclass('public.regency') IS NOT NULL
           AND to_regclass('public.equipment_subgroup') IS NOT NULL THEN
          RAISE EXCEPTION 'Both regency and equipment_subgroup tables exist; refusing an ambiguous data migration';
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'equipment_subgroup'
            AND column_name = 'provinceId'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'equipment_subgroup'
            AND column_name = 'groupId'
        ) THEN
          ALTER TABLE "equipment_subgroup" RENAME COLUMN "provinceId" TO "groupId";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "equipment_group"
        ADD COLUMN IF NOT EXISTS "description" character varying(500),
        ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true
    `);
    await queryRunner.query(`
      ALTER TABLE "equipment_subgroup"
        ADD COLUMN IF NOT EXISTS "description" character varying(500)
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_equipment_group_name"
      ON "equipment_group" ("name")
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_equipment_subgroup_group_name"
      ON "equipment_subgroup" ("groupId", "name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "UQ_equipment_subgroup_group_name"');
    await queryRunner.query('DROP INDEX IF EXISTS "UQ_equipment_group_name"');
    await queryRunner.query('ALTER TABLE "equipment_subgroup" DROP COLUMN IF EXISTS "description"');
    await queryRunner.query('ALTER TABLE "equipment_group" DROP COLUMN IF EXISTS "description"');
    await queryRunner.query('ALTER TABLE "equipment_group" DROP COLUMN IF EXISTS "isActive"');
    await queryRunner.query('ALTER TABLE "equipment_subgroup" RENAME COLUMN "groupId" TO "provinceId"');
    await queryRunner.query('ALTER TABLE "equipment_subgroup" RENAME TO "regency"');
    await queryRunner.query('ALTER TABLE "equipment_group" RENAME TO "province"');
  }
}
