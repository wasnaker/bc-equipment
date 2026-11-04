import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { GroupEntity } from './group.entity';

@Index('UQ_equipment_subgroup_group_name', ['groupId', 'name'], { unique: true })
@Entity({ name: 'equipment_subgroup' })
export class SubgroupEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: Number })
  groupId: number;

  @ManyToOne(() => GroupEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'groupId' })
  group?: GroupEntity;

  @Index()
  @Column({ type: String, length: 190 })
  name: string;

  @Column({ type: String, length: 20, nullable: true })
  abbr: string | null;

  @Column({ type: Number, default: 0 })
  sortOrder: number;

  @Column({ type: String, length: 20, nullable: true })
  color: string | null;

  @Column({ type: String, length: 500, nullable: true })
  description: string | null;

  @Column({ type: Boolean, default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
