import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Group } from '../domain/group';

export class FilterGroupDto {
  @ApiPropertyOptional({ example: 'jawa' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class SortGroupDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Group;

  @ApiProperty({ enum: ['ASC', 'DESC'] })
  @Transform(({ value }) => String(value).toUpperCase())
  @IsIn(['ASC', 'DESC'])
  order: string;
}

export class QueryGroupDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value === undefined || value === '' ? 1 : Number(value)))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === undefined || value === '' ? 10 : Number(value)))
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return value ? JSON.parse(value) : undefined;
    } catch {
      return undefined;
    }
  })
  @Type(() => FilterGroupDto)
  filters?: FilterGroupDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return value ? JSON.parse(value) : undefined;
    } catch {
      return undefined;
    }
  })
  @Type(() => SortGroupDto)
  sort?: SortGroupDto[] | null;
}