import { MigrationInterface, QueryRunner } from 'typeorm';
/** Equipment master types are shared classifications, not customer-owned assets. */
export declare class CreateEquipmentMaster1793710216000000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
