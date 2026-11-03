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

@Index('UQ_subgroup_group_name', ['groupId', 'name'], { unique: true })
@Entity({
  name: 'subgroup',
})
export class SubgroupEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: Number })
  groupId: number;

  @ManyToOne(() => GroupEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'groupId' })
  group?: GroupEntity;

  @Index()
  @Column({ type: String, length: 190 })
  name: string;

  /** Kode BPS 4 digit, mis. 11.01 */
  @Column({ type: String, unique: true, nullable: true })
  code: string | null;

  @Column({ type: String, default: 'kabupaten' })
  type: string;

  @Column({ type: Boolean, default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}