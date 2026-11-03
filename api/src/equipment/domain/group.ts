import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Group {
  @ApiProperty({ example: 1 })
  id: number | string;

  @ApiProperty({ example: 'Operations' })
  name: string;

  @ApiPropertyOptional({ example: 'Operational equipment grouping', nullable: true })
  description?: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;
}
