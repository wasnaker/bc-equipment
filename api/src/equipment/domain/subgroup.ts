import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Subgroup {
  @ApiProperty({ example: 1 })
  id: number | string;

  @ApiProperty({ example: 1 })
  groupId: number | string;

  @ApiProperty({ example: 'Heavy Equipment' })
  name: string;

  @ApiPropertyOptional({ example: 'Excavators, loaders and similar equipment', nullable: true })
  description?: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;
}
