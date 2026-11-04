import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FilterEquipmentDto {
  @ApiPropertyOptional({ name: 'subgroup_id' })
  @IsOptional()
  @Transform(({ value, obj }) => Number(value ?? obj?.subgroup_id))
  @IsInt() @Min(1)
  subgroupId?: number;

  @ApiPropertyOptional({ name: 'category_id' })
  @IsOptional()
  @Transform(({ value, obj }) => Number(value ?? obj?.category_id))
  @IsInt() @Min(1)
  categoryId?: number;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional() @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isActive?: boolean;
}
export class SortEquipmentDto {
  @Type(() => String) @IsString()
  orderBy: 'name' | 'code' | 'createdAt' | 'updatedAt';
  @Transform(({ value }) => String(value).toUpperCase())
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}
export class QueryEquipmentDto {
  @ApiPropertyOptional({ name: 'subgroup_id' })
  @IsOptional() @Transform(({ value, obj }) => Number(value ?? obj?.subgroup_id))
  @IsInt() @Min(1)
  subgroupId?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @Transform(({ value }) => value === undefined ? 1 : Number(value))
  @IsInt() @Min(1) page = 1;

  @ApiPropertyOptional({ default: 10, maximum: 50 })
  @IsOptional() @Transform(({ value }) => value === undefined ? 10 : Number(value))
  @IsInt() @Min(1) @Max(50) limit = 10;

  @ApiPropertyOptional({ name: 'category_id' })
  @IsOptional() @Transform(({ value, obj }) => Number(value ?? obj?.category_id))
  @IsInt() @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @Transform(({ value }) => { try { return value ? JSON.parse(value) : undefined; } catch { return undefined; } })
  filters?: FilterEquipmentDto;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @Transform(({ value }) => { try { return value ? JSON.parse(value) : undefined; } catch { return undefined; } })
  sort?: SortEquipmentDto[];
}
