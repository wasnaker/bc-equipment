import { Repository } from 'typeorm';
import { GroupEntity } from '../entities/group.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterGroupDto, SortGroupDto } from '../../../../dto/query-group.dto';
import { Group } from '../../../../domain/group';
import { GroupRepository } from '../../group.repository';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
export declare class GroupsRelationalRepository implements GroupRepository {
    private readonly repository;
    constructor(repository: Repository<GroupEntity>);
    create(data: Group): Promise<Group>;
    findManyWithPagination({ filterOptions, sortOptions, paginationOptions }: {
        filterOptions?: FilterGroupDto | null;
        sortOptions?: SortGroupDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<Group[]>;
    findAll(): Promise<Group[]>;
    findById(id: Group['id']): Promise<NullableType<Group>>;
    findByName(name: string): Promise<NullableType<Group>>;
    countAll(): Promise<number>;
    countWithFilter(filterOptions?: FilterGroupDto | null): Promise<number>;
    update(id: Group['id'], payload: Partial<Group>): Promise<Group | null>;
    remove(id: Group['id']): Promise<void>;
}
