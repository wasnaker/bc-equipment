import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Subgroup } from '../../domain/subgroup';

import { FilterSubgroupDto, SortSubgroupDto } from '../../dto/query-subgroup.dto';

export abstract class SubgroupRepository {
  abstract create(
    data: Omit<Subgroup, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Subgroup>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterSubgroupDto | null;
    sortOptions?: SortSubgroupDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Subgroup[]>;

  abstract findAll(): Promise<Subgroup[]>;

  abstract findById(id: Subgroup['id']): Promise<NullableType<Subgroup>>;

  abstract findByGroupId(
    groupId: Subgroup['groupId'],
  ): Promise<Subgroup[]>;

  abstract findByGroupIdAndName(
    groupId: Subgroup['groupId'],
    name: Subgroup['name'],
  ): Promise<NullableType<Subgroup>>;

  abstract countByGroupId(groupId: Subgroup['groupId']): Promise<number>;

  abstract countAll(): Promise<number>;

  abstract countWithFilter(
    filterOptions?: FilterSubgroupDto | null,
  ): Promise<number>;

  abstract update(
    id: Subgroup['id'],
    payload: DeepPartial<Subgroup>,
  ): Promise<Subgroup | null>;

  abstract remove(id: Subgroup['id']): Promise<void>;

  abstract removeByGroupId(groupId: Subgroup['groupId']): Promise<void>;
}