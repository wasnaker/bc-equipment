import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Subgroup } from '../domain/subgroup';

export class FilterSubgroupDto {
  @ApiPropertyOptional({ name: 'group_id', example: 1 })
  @IsOptional()
  @Transform(({ value, obj }) => {
    const raw = value ?? obj?.group_id;
    if (raw === undefined || raw === null || raw === '') return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : raw;
  })
  @IsInt()
  @Min(1)
  groupId?: Subgroup['groupId'];

  @ApiPropertyOptional({ example: 'heavy' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class SortSubgroupDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Subgroup;

  @ApiProperty({ enum: ['ASC', 'DESC'] })
  @Transform(({ value }) => String(value).toUpperCase())
  @IsIn(['ASC', 'DESC'])
  order: string;
}

export class QuerySubgroupDto {
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
  @Max(100)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ name: 'group_id', example: 1 })
  @IsOptional()
  @Transform(({ value, obj }) => {
    const raw = value ?? obj?.group_id;
    if (raw === undefined || raw === null || raw === '') return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : raw;
  })
  @IsInt()
  @Min(1)
  groupId?: Subgroup['groupId'];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => { try { return value ? JSON.parse(value) : undefined; } catch { return undefined; } })
  @Type(() => FilterSubgroupDto)
  filters?: FilterSubgroupDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => { try { return value ? JSON.parse(value) : undefined; } catch { return undefined; } })
  @Type(() => SortSubgroupDto)
  sort?: SortSubgroupDto[] | null;
}
