import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { CreateSubgroupDto } from './create-subgroup.dto';
import { Subgroup, SubgroupTypeEnum } from '../domain/subgroup';

export class UpdateSubgroupDto extends PartialType(CreateSubgroupDto) {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  groupId?: Subgroup['groupId'];

  @ApiPropertyOptional({ example: 'Bandung', maxLength: 190 })
  @IsOptional()
  @IsString()
  @MaxLength(190)
  name?: string;

  @ApiPropertyOptional({ example: 'kota', enum: SubgroupTypeEnum })
  @IsOptional()
  @IsEnum(SubgroupTypeEnum)
  type?: SubgroupTypeEnum;

  @ApiPropertyOptional({ example: '32.73', description: 'Kode BPS 4 digit' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\.\d{2}$/, { message: 'code harus format BPS 4 digit, mis. 32.73' })
  code?: string | null;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}