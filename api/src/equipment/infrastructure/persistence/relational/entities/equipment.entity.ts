import { BeforeInsert, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CategoryEntity } from './category.entity';
import { SubgroupEntity } from './subgroup.entity';
import { generateEquipmentUlid } from '../../../../utils/equipment-ulid.generator';

@Index('UQ_equipment_ulid', ['ulid'], { unique: true })
@Index('UQ_equipment_code', ['code'], { unique: true })
@Index('IDX_equipment_subgroupId', ['subgroupId'])
@Index('IDX_equipment_categoryId', ['categoryId'])
@Entity({ name: 'equipment' })
export class EquipmentEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 26 })
  ulid: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  code: string | null;

  @Column({ type: 'int' })
  subgroupId: number;

  @ManyToOne(() => SubgroupEntity, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'subgroupId' })
  subgroup?: SubgroupEntity;

  @Column({ type: 'int', nullable: true })
  categoryId: number | null;

  @ManyToOne(() => CategoryEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category?: CategoryEntity | null;

  @Column({ type: 'varchar', length: 190 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  @BeforeInsert()
  assignUlid(): void {
    if (!this.ulid) this.ulid = generateEquipmentUlid();
  }
}
