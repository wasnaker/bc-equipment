import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Adds classification metadata sourced from the legacy K3 equipment catalog.
 * Nullable columns keep existing user-managed records fully compatible.
 */
export declare class AddEquipmentClassificationMetadata1793710217000000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
