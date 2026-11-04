import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateEquipmentDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number) @IsInt() @Min(1)
  subgroupId: number;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  categoryId?: number | null;

  @ApiProperty({ example: 'Excavator', maxLength: 190 })
  @IsString() @IsNotEmpty() @MaxLength(190)
  name: string;

  @ApiPropertyOptional({ maxLength: 500, nullable: true })
  @IsOptional() @IsString() @MaxLength(500)
  description?: string | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  isActive?: boolean;
}
