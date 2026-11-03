import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { EquipmentAccessGuard } from '../security/equipment-access.guard';
import { InfinityPaginationResponseDto, InfinityPaginationResponse } from '../../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../../utils/infinity-pagination';

// The host supplies JWT authentication and resolves module-declared action
// permissions through EquipmentAccessGuard; no host-specific role IDs are assumed.

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Equipment')
@Controller({ path: 'equipment', version: '1' })
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  // ─── Groups ─────────────────────────────────────────────────────────────

  @ApiCreatedResponse({ type: Group })
  @UseGuards(EquipmentAccessGuard)
  @Post('groups')
  @HttpCode(HttpStatus.CREATED)
  createGroup(
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    return this.equipmentService.createGroup(createGroupDto);
  }

  @ApiOkResponse({ type: InfinityPaginationResponse(Group) })
  @Get('groups')
  @HttpCode(HttpStatus.OK)
  async findAllGroups(
    @Query() query: QueryGroupDto,
  ): Promise<InfinityPaginationResponseDto<Group>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.equipmentService.findManyGroupsWithPagination({
      filterOptions: query.filters ?? null,
      sortOptions: query.sort ?? null,
      paginationOptions: { page, limit },
    });

    const total = await this.equipmentService.countGroups(
      query.filters ?? null,
    );

    return infinityPagination(data, { page, limit }, total);
  }

  @ApiOkResponse({ type: Group })
  @Get('groups/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  findOneGroup(
    @Param('id', ParseIntPipe) id: Group['id'],
  ): Promise<NullableType<Group>> {
    return this.equipmentService.findGroupById(id);
  }

  @ApiOkResponse({ type: Group })
  @UseGuards(EquipmentAccessGuard)
  @Patch('groups/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  updateGroup(
    @Param('id', ParseIntPipe) id: Group['id'],
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    return this.equipmentService.updateGroup(id, updateGroupDto);
  }

  @UseGuards(EquipmentAccessGuard)
  @Delete('groups/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, required: true })
  removeGroup(
    @Param('id', ParseIntPipe) id: Group['id'],
  ): Promise<void> {
    return this.equipmentService.removeGroup(id);
  }

  // ─── Regencies ─────────────────────────────────────────────────────────────

  @ApiCreatedResponse({ type: Subgroup })
  @UseGuards(EquipmentAccessGuard)
  @Post('regencies')
  @HttpCode(HttpStatus.CREATED)
  createSubgroup(
    @Body() createSubgroupDto: CreateSubgroupDto,
  ): Promise<Subgroup> {
    return this.equipmentService.createSubgroup(createSubgroupDto);
  }

  @ApiOkResponse({ type: InfinityPaginationResponse(Subgroup) })
  @Get('regencies')
  @HttpCode(HttpStatus.OK)
  async findAllRegencies(
    @Query() query: QuerySubgroupDto,
  ): Promise<InfinityPaginationResponseDto<Subgroup>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const filterOptions: FilterSubgroupDto | null = query.filters ?? {};
    if (filterOptions) {
      if (query.groupId !== undefined) {
        filterOptions.groupId = query.groupId;
      }
    }

    const data = await this.equipmentService.findManyRegenciesWithPagination({
      filterOptions,
      sortOptions: query.sort ?? null,
      paginationOptions: { page, limit },
    });

    const total = await this.equipmentService.countRegencies(filterOptions);

    return infinityPagination(data, { page, limit }, total);
  }

  @ApiOkResponse({ type: Subgroup })
  @Get('regencies/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  findOneSubgroup(
    @Param('id', ParseIntPipe) id: Subgroup['id'],
  ): Promise<NullableType<Subgroup>> {
    return this.equipmentService.findSubgroupById(id);
  }

  @ApiOkResponse({ type: Subgroup })
  @UseGuards(EquipmentAccessGuard)
  @Patch('regencies/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  updateSubgroup(
    @Param('id', ParseIntPipe) id: Subgroup['id'],
    @Body() updateSubgroupDto: UpdateSubgroupDto,
  ): Promise<Subgroup> {
    return this.equipmentService.updateSubgroup(id, updateSubgroupDto);
  }

  @UseGuards(EquipmentAccessGuard)
  @Delete('regencies/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, required: true })
  removeSubgroup(
    @Param('id', ParseIntPipe) id: Subgroup['id'],
  ): Promise<void> {
    return this.equipmentService.removeSubgroup(id);
  }
}
