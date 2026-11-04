import { Repository } from 'typeorm';
import { SubgroupEntity } from '../entities/subgroup.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterSubgroupDto, SortSubgroupDto } from '../../../../dto/query-subgroup.dto';
import { Subgroup } from '../../../../domain/subgroup';
import { SubgroupRepository } from '../../subgroup.repository';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
export declare class SubgroupsRelationalRepository implements SubgroupRepository {
    private readonly repository;
    constructor(repository: Repository<SubgroupEntity>);
    create(data: Subgroup): Promise<Subgroup>;
    private buildWhere;
    findManyWithPagination({ filterOptions, sortOptions, paginationOptions }: {
        filterOptions?: FilterSubgroupDto | null;
        sortOptions?: SortSubgroupDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<Subgroup[]>;
    findAll(): Promise<Subgroup[]>;
    findById(id: Subgroup['id']): Promise<NullableType<Subgroup>>;
    findByGroupId(groupId: Subgroup['groupId']): Promise<Subgroup[]>;
    findByGroupIdAndName(groupId: Subgroup['groupId'], name: Subgroup['name']): Promise<NullableType<Subgroup>>;
    countByGroupId(groupId: Subgroup['groupId']): Promise<number>;
    countAll(): Promise<number>;
    countWithFilter(filters?: FilterSubgroupDto | null): Promise<number>;
    update(id: Subgroup['id'], payload: Partial<Subgroup>): Promise<Subgroup | null>;
    remove(id: Subgroup['id']): Promise<void>;
    removeByGroupId(groupId: Subgroup['groupId']): Promise<void>;
}
