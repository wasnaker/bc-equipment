import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Category } from '../domain/category';

export class CreateCategoryDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  subgroupId: Category['subgroupId'];

  @ApiProperty({ example: 'Hydraulic', maxLength: 190 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(190)
  name: string;

  @ApiPropertyOptional({ example: 'Hydraulic and mechanical category', maxLength: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
