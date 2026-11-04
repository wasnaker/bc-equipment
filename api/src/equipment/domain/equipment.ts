import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Equipment {
  @ApiProperty({ example: '12345' }) id: number | string;
  @ApiProperty({ example: '01JQZ8M6K7P2X4R9T5V3W1Y0AB' }) ulid: string;
  @ApiProperty({ example: '00AB12' }) code: string;
  @ApiProperty({ example: 1 }) categoryId: number | string;
  @ApiProperty({ example: 'Excavator' }) name: string;
  @ApiPropertyOptional({ example: 'Crawler excavator type', nullable: true }) description?: string | null;
  @ApiProperty({ example: true }) isActive: boolean;
  @ApiPropertyOptional() createdAt: Date;
  @ApiPropertyOptional() updatedAt: Date;
}
