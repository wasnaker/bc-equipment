import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { CreateSubgroupDto } from './create-subgroup.dto';
import { Subgroup } from '../domain/subgroup';

export class UpdateSubgroupDto extends PartialType(CreateSubgroupDto) {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  groupId?: Subgroup['groupId'];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
