import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query,
  HttpStatus, HttpCode, ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { QueryGroupDto } from '../dto/query-group.dto';
import { CreateSubgroupDto } from '../dto/create-subgroup.dto';
import { UpdateSubgroupDto } from '../dto/update-subgroup.dto';
import { QuerySubgroupDto, FilterSubgroupDto } from '../dto/query-subgroup.dto';
import { Group } from '../domain/group';
import { Subgroup } from '../domain/subgroup';
import { EquipmentService } from '../services/equipment.service';
import { NullableType } from '../../utils/types/nullable.type';
import { EquipmentAccessGuard } from '../security/equipment-access.guard';
import { InfinityPaginationResponseDto, InfinityPaginationResponse } from '../../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../../utils/infinity-pagination';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Equipment')
@Controller({ path: 'equipment', version: '1' })
export class EquipmentController {
  constructor(private readonly service: EquipmentService) {}

  @Post('groups')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Group })
  createGroup(@Body() dto: CreateGroupDto): Promise<Group> {
    return this.service.createGroup(dto);
  }

  @Get('groups')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: InfinityPaginationResponse(Group) })
  async findGroups(@Query() query: QueryGroupDto): Promise<InfinityPaginationResponseDto<Group>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 50);
    const data = await this.service.findManyGroupsWithPagination({
      filterOptions: query.filters ?? null,
      sortOptions: query.sort ?? null,
      paginationOptions: { page, limit },
    });
    const total = await this.service.countGroups(query.filters ?? null);
    return infinityPagination(data, { page, limit }, total);
  }

  @Get('groups/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Group })
  @ApiParam({ name: 'id', type: String, required: true })
  findGroup(@Param('id', ParseIntPipe) id: Group['id']): Promise<NullableType<Group>> {
    return this.service.findGroupById(id);
  }

  @Patch('groups/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Group })
  @ApiParam({ name: 'id', type: String, required: true })
  updateGroup(@Param('id', ParseIntPipe) id: Group['id'], @Body() dto: UpdateGroupDto): Promise<Group> {
    return this.service.updateGroup(id, dto);
  }

  @Delete('groups/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, required: true })
  removeGroup(@Param('id', ParseIntPipe) id: Group['id']): Promise<void> {
    return this.service.removeGroup(id);
  }

  @Post('subgroups')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Subgroup })
  createSubgroup(@Body() dto: CreateSubgroupDto): Promise<Subgroup> {
    return this.service.createSubgroup(dto);
  }

  @Get('subgroups')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: InfinityPaginationResponse(Subgroup) })
  async findSubgroups(@Query() query: QuerySubgroupDto): Promise<InfinityPaginationResponseDto<Subgroup>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 50);
    const filters: FilterSubgroupDto = { ...(query.filters ?? {}) };
    if (query.groupId !== undefined) filters.groupId = query.groupId;
    const data = await this.service.findManySubgroupsWithPagination({
      filterOptions: filters,
      sortOptions: query.sort ?? null,
      paginationOptions: { page, limit },
    });
    const total = await this.service.countSubgroups(filters);
    return infinityPagination(data, { page, limit }, total);
  }

  @Get('subgroups/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Subgroup })
  @ApiParam({ name: 'id', type: String, required: true })
  findSubgroup(@Param('id', ParseIntPipe) id: Subgroup['id']): Promise<NullableType<Subgroup>> {
    return this.service.findSubgroupById(id);
  }

  @Patch('subgroups/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Subgroup })
  @ApiParam({ name: 'id', type: String, required: true })
  updateSubgroup(@Param('id', ParseIntPipe) id: Subgroup['id'], @Body() dto: UpdateSubgroupDto): Promise<Subgroup> {
    return this.service.updateSubgroup(id, dto);
  }

  @Delete('subgroups/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, required: true })
  removeSubgroup(@Param('id', ParseIntPipe) id: Subgroup['id']): Promise<void> {
    return this.service.removeSubgroup(id);
  }
}
