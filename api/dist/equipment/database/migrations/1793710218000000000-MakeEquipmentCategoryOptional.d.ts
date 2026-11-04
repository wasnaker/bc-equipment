import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Equipment always belongs to a subgroup. A category is optional because
 * the PRFX source catalog contains equipment records without a category.
 */
export declare class MakeEquipmentCategoryOptional1793710218000000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
