import { MigrationInterface, QueryRunner } from 'typeorm';

/** Equipment master types are shared classifications, not customer-owned assets. */
export class CreateEquipmentMaster1793710216000000000 implements MigrationInterface {
  name = 'CreateEquipmentMaster1793710216000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "equipment" (
        "id" BIGSERIAL NOT NULL,
        "ulid" varchar(26) NOT NULL,
        "code" varchar(6),
        "categoryId" integer NOT NULL,
        "name" varchar(190) NOT NULL,
        "description" varchar(500),
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_equipment_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_equipment_category" FOREIGN KEY ("categoryId")
          REFERENCES "equipment_category"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_equipment_ulid" ON "equipment" ("ulid")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_equipment_code" ON "equipment" ("code")`);
    await queryRunner.query(`CREATE INDEX "IDX_equipment_categoryId" ON "equipment" ("categoryId")`);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_equipment_category_name_ci"
      ON "equipment" ("categoryId", lower(btrim("name")))
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "bc_equipment_code6"(value bigint)
      RETURNS text AS $fn$
      DECLARE
        alphabet CONSTANT text := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
        modulus CONSTANT bigint := 1073741824;
        n bigint;
        result text := '';
        i int;
      BEGIN
        n := (((value % modulus) * 48271) + 1) % modulus;
        FOR i IN 1..6 LOOP
          result := substr(alphabet, (n % 32)::int + 1, 1) || result;
          n := n / 32;
        END LOOP;
        RETURN result;
      END;
      $fn$ LANGUAGE plpgsql IMMUTABLE;
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "bc_equipment_assign_code"() RETURNS trigger AS $fn$
      BEGIN
        IF NEW."code" IS NULL THEN
          UPDATE "equipment" SET "code" = "bc_equipment_code6"(NEW."id")
          WHERE "id" = NEW."id";
        END IF;
        RETURN NEW;
      END;
      $fn$ LANGUAGE plpgsql;
    `);
    await queryRunner.query(`
      CREATE TRIGGER "trg_equipment_code" AFTER INSERT ON "equipment"
      FOR EACH ROW EXECUTE FUNCTION "bc_equipment_assign_code"();
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TRIGGER IF EXISTS "trg_equipment_code" ON "equipment"');
    await queryRunner.query('DROP FUNCTION IF EXISTS "bc_equipment_assign_code"');
    await queryRunner.query('DROP FUNCTION IF EXISTS "bc_equipment_code6"');
    await queryRunner.query('DROP INDEX IF EXISTS "UQ_equipment_category_name_ci"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_equipment_categoryId"');
    await queryRunner.query('DROP INDEX IF EXISTS "UQ_equipment_code"');
    await queryRunner.query('DROP INDEX IF EXISTS "UQ_equipment_ulid"');
    await queryRunner.query('DROP TABLE IF EXISTS "equipment"');
  }
}
