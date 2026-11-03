import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Group } from '../../domain/group';

import { FilterGroupDto, SortGroupDto } from '../../dto/query-group.dto';

export abstract class GroupRepository {
  abstract create(
    data: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Group>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterGroupDto | null;
    sortOptions?: SortGroupDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Group[]>;

  abstract findAll(): Promise<Group[]>;

  abstract findById(id: Group['id']): Promise<NullableType<Group>>;

  abstract findByName(name: string): Promise<NullableType<Group>>;

  abstract findByIsoCode(
    isoCode: Group['isoCode'],
  ): Promise<NullableType<Group>>;

  abstract countAll(): Promise<number>;

  abstract countWithFilter(
    filterOptions?: FilterGroupDto | null,
  ): Promise<number>;

  abstract update(
    id: Group['id'],
    payload: DeepPartial<Group>,
  ): Promise<Group | null>;

  abstract remove(id: Group['id']): Promise<void>;
}