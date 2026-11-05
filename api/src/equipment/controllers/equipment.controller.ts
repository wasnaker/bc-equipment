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
import { Category } from '../domain/category';
import { Equipment } from '../domain/equipment';
import { CreateEquipmentDto } from '../dto/create-equipment.dto';
import { UpdateEquipmentDto } from '../dto/update-equipment.dto';
import { QueryEquipmentDto, FilterEquipmentDto } from '../dto/query-equipment.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { QueryCategoryDto, FilterCategoryDto } from '../dto/query-category.dto';
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
    const limit = Math.min(query.limit ?? 10, 100);
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
    const limit = Math.min(query.limit ?? 10, 100);
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

  @Post('categories')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Category })
  createCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.service.createCategory(dto);
  }

  @Get('categories')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: InfinityPaginationResponse(Category) })
  async findCategories(@Query() query: QueryCategoryDto): Promise<InfinityPaginationResponseDto<Category>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const filters: FilterCategoryDto = { ...(query.filters ?? {}) };
    if (query.subgroupId !== undefined) filters.subgroupId = query.subgroupId;
    const data = await this.service.findManyCategoriesWithPagination({
      filterOptions: filters,
      sortOptions: query.sort ?? null,
      paginationOptions: { page, limit },
    });
    const total = await this.service.countCategories(filters);
    return infinityPagination(data, { page, limit }, total);
  }

  @Get('categories/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Category })
  @ApiParam({ name: 'id', type: String, required: true })
  findCategory(@Param('id', ParseIntPipe) id: Category['id']): Promise<NullableType<Category>> {
    return this.service.findCategoryById(id);
  }

  @Patch('categories/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Category })
  @ApiParam({ name: 'id', type: String, required: true })
  updateCategory(@Param('id', ParseIntPipe) id: Category['id'], @Body() dto: UpdateCategoryDto): Promise<Category> {
    return this.service.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, required: true })
  removeCategory(@Param('id', ParseIntPipe) id: Category['id']): Promise<void> {
    return this.service.removeCategory(id);
  }


  @Post('items')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Equipment })
  createEquipment(@Body() dto: CreateEquipmentDto): Promise<Equipment> { return this.service.createEquipment(dto); }

  @Get('items')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: InfinityPaginationResponse(Equipment) })
  async findEquipment(@Query() query: QueryEquipmentDto): Promise<InfinityPaginationResponseDto<Equipment>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const filters: FilterEquipmentDto = { ...(query.filters ?? {}) };
    if (query.subgroupId !== undefined) filters.subgroupId = query.subgroupId;
    if (query.categoryId !== undefined) filters.categoryId = query.categoryId;
    const data = await this.service.findManyEquipmentWithPagination({ filterOptions: filters, sortOptions: query.sort ?? null, paginationOptions: { page, limit } });
    const total = await this.service.countEquipment(filters);
    return infinityPagination(data, { page, limit }, total);
  }

  @Get('items/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Equipment })
  findEquipmentById(@Param('id', ParseIntPipe) id: Equipment['id']): Promise<NullableType<Equipment>> { return this.service.findEquipmentById(id); }

  @Patch('items/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Equipment })
  updateEquipment(@Param('id', ParseIntPipe) id: Equipment['id'], @Body() dto: UpdateEquipmentDto): Promise<Equipment> { return this.service.updateEquipment(id, dto); }

  @Delete('items/:id')
  @UseGuards(EquipmentAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeEquipment(@Param('id', ParseIntPipe) id: Equipment['id']): Promise<void> { return this.service.removeEquipment(id); }


}
