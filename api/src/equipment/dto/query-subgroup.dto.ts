import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  Max,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Subgroup, SubgroupTypeEnum } from '../domain/subgroup';

export class FilterSubgroupDto {
  @ApiPropertyOptional({ name: 'group_id', example: 1 })
  @IsOptional()
  @Transform(({ value, obj }) => {
    const rawValue = value ?? obj?.group_id;
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      return undefined;
    }
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : rawValue;
  })
  @IsInt()
  @Min(1)
  groupId?: Subgroup['groupId'];

  @ApiPropertyOptional({ enum: SubgroupTypeEnum })
  @IsOptional()
  @IsEnum(SubgroupTypeEnum)
  type?: SubgroupTypeEnum;
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
  @Max(50)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ name: 'group_id', example: 1 })
  @IsOptional()
  @Transform(({ value, obj }) => {
    const rawValue = value ?? obj?.group_id;
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      return undefined;
    }
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : rawValue;
  })
  @IsInt()
  @Min(1)
  groupId?: Subgroup['groupId'];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return value ? JSON.parse(value) : undefined;
    } catch {
      return undefined;
    }
  })
  @Type(() => FilterSubgroupDto)
  filters?: FilterSubgroupDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return value ? JSON.parse(value) : undefined;
    } catch {
      return undefined;
    }
  })
  @Type(() => SortSubgroupDto)
  sort?: SortSubgroupDto[] | null;
}
