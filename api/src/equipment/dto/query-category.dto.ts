import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Category } from '../domain/category';

export class FilterCategoryDto {
  @ApiPropertyOptional({ name: 'subgroup_id', example: 1 })
  @IsOptional()
  @Transform(({ value, obj }) => {
    const raw = value ?? obj?.subgroup_id;
    if (raw === undefined || raw === null || raw === '') return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : raw;
  })
  @IsInt()
  @Min(1)
  subgroupId?: Category['subgroupId'];

  @ApiPropertyOptional({ example: 'hydraulic' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class SortCategoryDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Category;

  @ApiProperty({ enum: ['ASC', 'DESC'] })
  @Transform(({ value }) => String(value).toUpperCase())
  @IsIn(['ASC', 'DESC'])
  order: string;
}

export class QueryCategoryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Transform(({ value }) => (value === undefined || value === '' ? 1 : Number(value)))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 10 })
  @Transform(({ value }) => (value === undefined || value === '' ? 10 : Number(value)))
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ name: 'subgroup_id', example: 1 })
  @IsOptional()
  @Transform(({ value, obj }) => {
    const raw = value ?? obj?.subgroup_id;
    if (raw === undefined || raw === null || raw === '') return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : raw;
  })
  @IsInt()
  @Min(1)
  subgroupId?: Category['subgroupId'];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => { try { return value ? JSON.parse(value) : undefined; } catch { return undefined; } })
  @Type(() => FilterCategoryDto)
  filters?: FilterCategoryDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => { try { return value ? JSON.parse(value) : undefined; } catch { return undefined; } })
  @Type(() => SortCategoryDto)
  sort?: SortCategoryDto[] | null;
}
