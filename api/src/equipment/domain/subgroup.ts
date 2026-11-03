import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SubgroupTypeEnum {
  KABUPATEN = 'kabupaten',
  KOTA = 'kota',
}

export const SUBGROUP_TYPES = [
  { value: SubgroupTypeEnum.KABUPATEN, label: 'Kabupaten' },
  { value: SubgroupTypeEnum.KOTA, label: 'Kota' },
];

export class Subgroup {
  @ApiProperty({ example: 1 })
  id: number | string;

  @ApiProperty({ example: 1 })
  groupId: number | string;

  @ApiProperty({ example: 'Bandung' })
  name: string;

  @ApiPropertyOptional({ example: '32.73', description: 'Kode BPS 4 digit' })
  code?: string | null;

  @ApiProperty({ example: 'kota' })
  type: SubgroupTypeEnum;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;
}