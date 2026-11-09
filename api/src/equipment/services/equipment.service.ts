import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { FilterGroupDto, SortGroupDto } from '../dto/query-group.dto';
import { CreateSubgroupDto } from '../dto/create-subgroup.dto';
import { UpdateSubgroupDto } from '../dto/update-subgroup.dto';
import { FilterSubgroupDto, SortSubgroupDto } from '../dto/query-subgroup.dto';
import { Group } from '../domain/group';
import { Subgroup } from '../domain/subgroup';
import { Category } from '../domain/category';
import { Equipment } from '../domain/equipment';
import { CreateEquipmentDto } from '../dto/create-equipment.dto';
import { UpdateEquipmentDto } from '../dto/update-equipment.dto';
import { FilterEquipmentDto, SortEquipmentDto } from '../dto/query-equipment.dto';
import { EquipmentRepository } from '../infrastructure/persistence/equipment.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { FilterCategoryDto, SortCategoryDto } from '../dto/query-category.dto';
import { GroupRepository } from '../infrastructure/persistence/group.repository';
import { SubgroupRepository } from '../infrastructure/persistence/subgroup.repository';
import { CategoryRepository } from '../infrastructure/persistence/category.repository';
import { NullableType } from '../../utils/types/nullable.type';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { CustomerBranchDirectoryClient } from '../customer-branch-directory.client';

@Injectable()
export class EquipmentService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly subgroupRepository: SubgroupRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly equipmentRepository: EquipmentRepository,
    private readonly customerBranches: CustomerBranchDirectoryClient,
  ) {}

  /** Read Customer-owned branch context through its public service contract. */
  async findCustomerBranchContext(branchId: string) {
    if (!/^\\d+$/.test(branchId)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { branch: 'branchNotExists' },
      });
    }
    const branch = await this.customerBranches.findBranchById(branchId);
    if (!branch) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { branch: 'branchNotExists' },
      });
    }
    return branch;
  }

  async createGroup(dto: CreateGroupDto): Promise<Group> {
    if (await this.groupRepository.findByName(dto.name)) {
      throw new UnprocessableEntityException({ status: HttpStatus.UNPROCESSABLE_ENTITY, errors: { name: 'groupNameAlreadyExists' } });
    }
    return this.groupRepository.create({
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      isActive: dto.isActive ?? true,
    });
  }

  async findManyGroupsWithPagination(args: { filterOptions?: FilterGroupDto | null; sortOptions?: SortGroupDto[] | null; paginationOptions: IPaginationOptions }): Promise<Group[]> {
    return this.groupRepository.findManyWithPagination(args);
  }

  findGroupById(id: Group['id']): Promise<NullableType<Group>> {
    return this.groupRepository.findById(id);
  }

  async updateGroup(id: Group['id'], dto: UpdateGroupDto): Promise<Group> {
    const current = await this.groupRepository.findById(id);
    if (!current) throw new UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
    if (dto.name?.trim()) {
      const duplicate = await this.groupRepository.findByName(dto.name.trim());
      if (duplicate && Number(duplicate.id) !== Number(id)) throw new UnprocessableEntityException({ status: 422, errors: { name: 'groupNameAlreadyExists' } });
    }
    const updated = await this.groupRepository.update(id, { ...dto, name: dto.name?.trim() });
    if (!updated) throw new UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
    return updated;
  }

  async removeGroup(id: Group['id']): Promise<void> {
    if (!(await this.groupRepository.findById(id))) throw new UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
    await this.groupRepository.remove(id);
  }

  countGroups(filters?: FilterGroupDto | null): Promise<number> {
    return this.groupRepository.countWithFilter(filters);
  }

  async createSubgroup(dto: CreateSubgroupDto): Promise<Subgroup> {
    if (!(await this.groupRepository.findById(dto.groupId))) throw new UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
    if (await this.subgroupRepository.findByGroupIdAndName(dto.groupId, dto.name.trim())) throw new UnprocessableEntityException({ status: 422, errors: { name: 'subgroupNameAlreadyExists' } });
    return this.subgroupRepository.create({
      groupId: dto.groupId,
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      isActive: dto.isActive ?? true,
    });
  }

  findManySubgroupsWithPagination(args: { filterOptions?: FilterSubgroupDto | null; sortOptions?: SortSubgroupDto[] | null; paginationOptions: IPaginationOptions }): Promise<Subgroup[]> {
    return this.subgroupRepository.findManyWithPagination(args);
  }

  findSubgroupById(id: Subgroup['id']): Promise<NullableType<Subgroup>> {
    return this.subgroupRepository.findById(id);
  }

  async updateSubgroup(id: Subgroup['id'], dto: UpdateSubgroupDto): Promise<Subgroup> {
    const current = await this.subgroupRepository.findById(id);
    if (!current) throw new UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
    const targetGroupId = dto.groupId ?? current.groupId;
    if (dto.groupId !== undefined && !(await this.groupRepository.findById(dto.groupId))) throw new UnprocessableEntityException({ status: 422, errors: { group: 'groupNotExists' } });
    const targetName = dto.name?.trim() ?? current.name;
    const duplicate = await this.subgroupRepository.findByGroupIdAndName(targetGroupId, targetName);
    if (duplicate && Number(duplicate.id) !== Number(id)) throw new UnprocessableEntityException({ status: 422, errors: { name: 'subgroupNameAlreadyExists' } });
    const updated = await this.subgroupRepository.update(id, { ...dto, name: dto.name?.trim() });
    if (!updated) throw new UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
    return updated;
  }

  async removeSubgroup(id: Subgroup['id']): Promise<void> {
    if (!(await this.subgroupRepository.findById(id))) throw new UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
    await this.subgroupRepository.remove(id);
  }

  countSubgroups(filters?: FilterSubgroupDto | null): Promise<number> {
    return this.subgroupRepository.countWithFilter(filters);
  }

  countSubgroupsByGroupId(groupId: Subgroup['groupId']): Promise<number> {
    return this.subgroupRepository.countByGroupId(groupId);
  }

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    if (!(await this.subgroupRepository.findById(dto.subgroupId))) throw new UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
    if (await this.categoryRepository.findBySubgroupIdAndName(dto.subgroupId, dto.name.trim())) throw new UnprocessableEntityException({ status: 422, errors: { name: 'categoryNameAlreadyExists' } });
    return this.categoryRepository.create({
      subgroupId: dto.subgroupId,
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      isActive: dto.isActive ?? true,
    });
  }

  findManyCategoriesWithPagination(args: { filterOptions?: FilterCategoryDto | null; sortOptions?: SortCategoryDto[] | null; paginationOptions: IPaginationOptions }): Promise<Category[]> {
    return this.categoryRepository.findManyWithPagination(args);
  }

  findCategoryById(id: Category['id']): Promise<NullableType<Category>> {
    return this.categoryRepository.findById(id);
  }

  async updateCategory(id: Category['id'], dto: UpdateCategoryDto): Promise<Category> {
    const current = await this.categoryRepository.findById(id);
    if (!current) throw new UnprocessableEntityException({ status: 422, errors: { category: 'categoryNotExists' } });
    const targetSubgroupId = dto.subgroupId ?? current.subgroupId;
    if (dto.subgroupId !== undefined && !(await this.subgroupRepository.findById(dto.subgroupId))) throw new UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
    const targetName = dto.name?.trim() ?? current.name;
    const duplicate = await this.categoryRepository.findBySubgroupIdAndName(targetSubgroupId, targetName);
    if (duplicate && Number(duplicate.id) !== Number(id)) throw new UnprocessableEntityException({ status: 422, errors: { name: 'categoryNameAlreadyExists' } });
    const updated = await this.categoryRepository.update(id, { ...dto, name: dto.name?.trim() });
    if (!updated) throw new UnprocessableEntityException({ status: 422, errors: { category: 'categoryNotExists' } });
    return updated;
  }

  async removeCategory(id: Category['id']): Promise<void> {
    if (!(await this.categoryRepository.findById(id))) throw new UnprocessableEntityException({ status: 422, errors: { category: 'categoryNotExists' } });
    await this.categoryRepository.remove(id);
  }

  countCategories(filters?: FilterCategoryDto | null): Promise<number> {
    return this.categoryRepository.countWithFilter(filters);
  }

  countCategoriesBySubgroupId(subgroupId: Category['subgroupId']): Promise<number> {
    return this.categoryRepository.countBySubgroupId(subgroupId);
  }


  async createEquipment(dto: CreateEquipmentDto): Promise<Equipment> {
    if (!(await this.subgroupRepository.findById(dto.subgroupId))) {
      throw new UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
    }
    const categoryId = dto.categoryId ?? null;
    if (categoryId !== null) {
      const category = await this.categoryRepository.findById(categoryId);
      if (!category) throw new UnprocessableEntityException({ status: 422, errors: { category: 'categoryNotExists' } });
      if (Number(category.subgroupId) !== Number(dto.subgroupId)) {
        throw new UnprocessableEntityException({ status: 422, errors: { category: 'categorySubgroupMismatch' } });
      }
    }
    const name = dto.name.trim();
    if (await this.equipmentRepository.findBySubgroupIdCategoryIdAndName(dto.subgroupId, categoryId, name)) {
      throw new UnprocessableEntityException({ status: 422, errors: { name: 'equipmentNameAlreadyExists' } });
    }
    return this.equipmentRepository.create({
      subgroupId: dto.subgroupId,
      categoryId,
      name,
      description: dto.description?.trim() || null,
      isActive: dto.isActive ?? true,
    });
  }

  findManyEquipmentWithPagination(args: { filterOptions?: FilterEquipmentDto | null; sortOptions?: SortEquipmentDto[] | null; paginationOptions: IPaginationOptions }): Promise<Equipment[]> {
    return this.equipmentRepository.findManyWithPagination(args);
  }

  findEquipmentById(id: Equipment['id']): Promise<NullableType<Equipment>> { return this.equipmentRepository.findById(id); }

  async updateEquipment(id: Equipment['id'], dto: UpdateEquipmentDto): Promise<Equipment> {
    const current = await this.equipmentRepository.findById(id);
    if (!current) throw new UnprocessableEntityException({ status: 422, errors: { equipment: 'equipmentNotExists' } });
    const subgroupId = dto.subgroupId ?? Number(current.subgroupId);
    if (dto.subgroupId !== undefined && !(await this.subgroupRepository.findById(subgroupId))) {
      throw new UnprocessableEntityException({ status: 422, errors: { subgroup: 'subgroupNotExists' } });
    }
    const categoryId = dto.categoryId !== undefined ? dto.categoryId : current.categoryId;
    if (categoryId !== null) {
      const category = await this.categoryRepository.findById(categoryId);
      if (!category) throw new UnprocessableEntityException({ status: 422, errors: { category: 'categoryNotExists' } });
      if (Number(category.subgroupId) !== Number(subgroupId)) {
        throw new UnprocessableEntityException({ status: 422, errors: { category: 'categorySubgroupMismatch' } });
      }
    }
    const name = dto.name?.trim() ?? current.name;
    const duplicate = await this.equipmentRepository.findBySubgroupIdCategoryIdAndName(subgroupId, categoryId, name);
    if (duplicate && String(duplicate.id) !== String(id)) {
      throw new UnprocessableEntityException({ status: 422, errors: { name: 'equipmentNameAlreadyExists' } });
    }
    const updated = await this.equipmentRepository.update(id, { ...dto, subgroupId, categoryId, name });
    if (!updated) throw new UnprocessableEntityException({ status: 422, errors: { equipment: 'equipmentNotExists' } });
    return updated;
  }

  async removeEquipment(id: Equipment['id']): Promise<void> {
    if (!(await this.equipmentRepository.findById(id))) throw new UnprocessableEntityException({ status: 422, errors: { equipment: 'equipmentNotExists' } });
    await this.equipmentRepository.remove(id);
  }

  countEquipment(filters?: FilterEquipmentDto | null): Promise<number> { return this.equipmentRepository.countWithFilter(filters); }
  countEquipmentByCategoryId(categoryId: Equipment['categoryId']): Promise<number> { return this.equipmentRepository.countByCategoryId(categoryId); }

}
