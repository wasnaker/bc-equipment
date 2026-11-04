import { MigrationInterface, QueryRunner } from 'typeorm';
/** Adds categories as children of equipment subgroups. */
export declare class CreateEquipmentCategory1793710215000000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
