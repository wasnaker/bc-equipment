import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Subgroup, SubgroupTypeEnum } from '../domain/subgroup';

export class CreateSubgroupDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  groupId: Subgroup['groupId'];

  @ApiProperty({ example: 'Bandung', maxLength: 190 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(190)
  name: string;

  @ApiProperty({ example: 'kota', enum: SubgroupTypeEnum })
  @IsNotEmpty()
  @IsEnum(SubgroupTypeEnum)
  type: SubgroupTypeEnum;

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