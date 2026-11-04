import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { SubgroupEntity } from './subgroup.entity';

@Index('UQ_equipment_category_subgroup_name', ['subgroupId', 'name'], { unique: true })
@Entity({ name: 'equipment_category' })
export class CategoryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: Number })
  subgroupId: number;

  @ManyToOne(() => SubgroupEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'subgroupId' })
  subgroup?: SubgroupEntity;

  @Index()
  @Column({ type: String, length: 190 })
  name: string;

  @Column({ type: String, length: 500, nullable: true })
  description: string | null;

  @Column({ type: Boolean, default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
