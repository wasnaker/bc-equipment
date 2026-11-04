import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Index('UQ_equipment_group_name', ['name'], { unique: true })
@Index('UQ_equipment_group_code', ['code'], { unique: true, where: '"code" IS NOT NULL' })
@Entity({ name: 'equipment_group' })
export class GroupEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, length: 190 })
  name: string;

  @Column({ type: String, length: 30, nullable: true })
  code: string | null;

  @Column({ type: String, length: 20, nullable: true })
  abbr: string | null;

  @Column({ type: String, length: 500, nullable: true })
  description: string | null;

  @Column({ type: Boolean, default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
