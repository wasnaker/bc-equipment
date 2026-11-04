import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Category {
  @ApiProperty({ example: 1 })
  id: number | string;

  @ApiProperty({ example: 1 })
  subgroupId: number | string;

  @ApiProperty({ example: 'Hydraulic' })
  name: string;

  @ApiPropertyOptional({ example: 'Hydraulic and mechanical category', nullable: true })
  description?: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;
}
