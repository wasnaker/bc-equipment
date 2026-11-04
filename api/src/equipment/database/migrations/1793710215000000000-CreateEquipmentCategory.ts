import { MigrationInterface, QueryRunner } from 'typeorm';

/** Adds categories as children of equipment subgroups. */
export class CreateEquipmentCategory1793710215000000000 implements MigrationInterface {
  name = 'CreateEquipmentCategory1793710215000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "equipment_category" (
        "id" SERIAL NOT NULL,
        "subgroupId" integer NOT NULL,
        "name" character varying(190) NOT NULL,
        "description" character varying(500),
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_equipment_category_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_equipment_category_subgroup" FOREIGN KEY ("subgroupId")
          REFERENCES "equipment_subgroup"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_equipment_category_subgroup_name"
      ON "equipment_category" ("subgroupId", "name")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_equipment_category_subgroupId"
      ON "equipment_category" ("subgroupId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_equipment_category_subgroupId"');
    await queryRunner.query('DROP INDEX IF EXISTS "UQ_equipment_category_subgroup_name"');
    await queryRunner.query('DROP TABLE IF EXISTS "equipment_category"');
  }
}
