"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEquipmentClassificationMetadata1793710217000000000 = void 0;
/**
 * Adds classification metadata sourced from the legacy K3 equipment catalog.
 * Nullable columns keep existing user-managed records fully compatible.
 */
class AddEquipmentClassificationMetadata1793710217000000000 {
    constructor() {
        this.name = 'AddEquipmentClassificationMetadata1793710217000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "equipment_group"
        ADD COLUMN IF NOT EXISTS "code" character varying(30),
        ADD COLUMN IF NOT EXISTS "abbr" character varying(20)
    `);
        await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_equipment_group_code"
      ON "equipment_group" ("code") WHERE "code" IS NOT NULL
    `);
        await queryRunner.query(`
      ALTER TABLE "equipment_subgroup"
        ADD COLUMN IF NOT EXISTS "abbr" character varying(20),
        ADD COLUMN IF NOT EXISTS "sortOrder" integer NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "color" character varying(20)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "equipment_subgroup"
        DROP COLUMN IF EXISTS "color",
        DROP COLUMN IF EXISTS "sortOrder",
        DROP COLUMN IF EXISTS "abbr"
    `);
        await queryRunner.query('DROP INDEX IF EXISTS "UQ_equipment_group_code"');
        await queryRunner.query(`
      ALTER TABLE "equipment_group"
        DROP COLUMN IF EXISTS "abbr",
        DROP COLUMN IF EXISTS "code"
    `);
    }
}
exports.AddEquipmentClassificationMetadata1793710217000000000 = AddEquipmentClassificationMetadata1793710217000000000;
