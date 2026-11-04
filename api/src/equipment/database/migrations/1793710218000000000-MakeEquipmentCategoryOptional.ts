import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Equipment always belongs to a subgroup. A category is optional because
 * the PRFX source catalog contains equipment records without a category.
 */
export class MakeEquipmentCategoryOptional1793710218000000000
  implements MigrationInterface
{
  name = 'MakeEquipmentCategoryOptional1793710218000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "equipment" ADD COLUMN "subgroupId" integer
    `);
    await queryRunner.query(`
      UPDATE "equipment" equipment
      SET "subgroupId" = category."subgroupId"
      FROM "equipment_category" category
      WHERE equipment."categoryId" = category."id"
    `);
    await queryRunner.query(`
      UPDATE "equipment"
      SET "categoryId" = NULL
      WHERE "categoryId" IN (
        SELECT "id" FROM "equipment_category" WHERE "name" = 'Umum'
      )
    `);
    await queryRunner.query(`
      DELETE FROM "equipment_category" WHERE "name" = 'Umum'
    `);
    await queryRunner.query(`
      ALTER TABLE "equipment"
        ALTER COLUMN "subgroupId" SET NOT NULL,
        ALTER COLUMN "categoryId" DROP NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "equipment" DROP CONSTRAINT IF EXISTS "FK_equipment_category"
    `);
    await queryRunner.query(`
      ALTER TABLE "equipment" ADD CONSTRAINT "FK_equipment_category"
      FOREIGN KEY ("categoryId") REFERENCES "equipment_category"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "equipment"
      ADD CONSTRAINT "FK_equipment_subgroup"
      FOREIGN KEY ("subgroupId") REFERENCES "equipment_subgroup"("id")
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_equipment_subgroupId" ON "equipment" ("subgroupId")
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "UQ_equipment_category_name_ci"
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_equipment_subgroup_category_name_ci"
      ON "equipment" ("subgroupId", COALESCE("categoryId", 0), lower(btrim("name")))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "UQ_equipment_subgroup_category_name_ci"
    `);
    await queryRunner.query(`
      INSERT INTO "equipment_category" ("subgroupId", "name", "description", "isActive")
      SELECT DISTINCT equipment."subgroupId", 'Umum', NULL, true
      FROM "equipment" equipment
      WHERE equipment."categoryId" IS NULL
        AND NOT EXISTS (
          SELECT 1 FROM "equipment_category" category
          WHERE category."subgroupId" = equipment."subgroupId"
            AND category."name" = 'Umum'
        )
    `);
    await queryRunner.query(`
      UPDATE "equipment" equipment
      SET "categoryId" = category."id"
      FROM "equipment_category" category
      WHERE equipment."categoryId" IS NULL
        AND category."subgroupId" = equipment."subgroupId"
        AND category."name" = 'Umum'
    `);
    await queryRunner.query(`
      ALTER TABLE "equipment" ALTER COLUMN "categoryId" SET NOT NULL
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_equipment_subgroupId"
    `);
    await queryRunner.query(`
      ALTER TABLE "equipment" DROP CONSTRAINT IF EXISTS "FK_equipment_category"
    `);
    await queryRunner.query(`
      ALTER TABLE "equipment" ADD CONSTRAINT "FK_equipment_category"
      FOREIGN KEY ("categoryId") REFERENCES "equipment_category"("id")
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "equipment"
        DROP CONSTRAINT IF EXISTS "FK_equipment_subgroup",
        DROP COLUMN "subgroupId"
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_equipment_category_name_ci"
      ON "equipment" ("categoryId", lower(btrim("name")))
    `);
  }
}
