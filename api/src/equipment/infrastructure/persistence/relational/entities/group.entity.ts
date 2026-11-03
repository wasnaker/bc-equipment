import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Index('UQ_group_name', ['name'], { unique: true })
@Entity({
  name: 'group',
})
export class GroupEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  name: string;

  @Column({ type: String, unique: true, nullable: true })
  isoCode: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}