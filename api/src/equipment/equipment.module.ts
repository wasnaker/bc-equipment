import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './infrastructure/persistence/relational/entities/group.entity';
import { SubgroupEntity } from './infrastructure/persistence/relational/entities/subgroup.entity';
import { CategoryEntity } from './infrastructure/persistence/relational/entities/category.entity';
import { EquipmentEntity } from './infrastructure/persistence/relational/entities/equipment.entity';
import { EquipmentService } from './services/equipment.service';
import { EquipmentController } from './controllers/equipment.controller';
import { GroupRepository } from './infrastructure/persistence/group.repository';
import { SubgroupRepository } from './infrastructure/persistence/subgroup.repository';
import { CategoryRepository } from './infrastructure/persistence/category.repository';
import { EquipmentRepository } from './infrastructure/persistence/equipment.repository';
import { GroupsRelationalRepository } from './infrastructure/persistence/relational/repositories/group.repository';
import { SubgroupsRelationalRepository } from './infrastructure/persistence/relational/repositories/subgroup.repository';
import { CategoriesRelationalRepository } from './infrastructure/persistence/relational/repositories/category.repository';
import { EquipmentRelationalRepository } from './infrastructure/persistence/relational/repositories/equipment.repository';
import { EquipmentAccessGuard } from './security/equipment-access.guard';
import { EquipmentMasterDataSeedService } from './database/seeds/master-data/equipment-master-data.seed.service';
import { EquipmentCatalogSeedService } from './database/seeds/master-data/equipment-catalog.seed.service';
import { EQUIPMENT_MODULE_OPTIONS, EquipmentModuleAsyncOptions } from './equipment.options';
export { EQUIPMENT_MODULE_OPTIONS } from './equipment.options';
export type { EquipmentModuleOptions, EquipmentModuleAsyncOptions } from './equipment.options';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, SubgroupEntity, CategoryEntity, EquipmentEntity])],
  providers: [
    EquipmentService, EquipmentAccessGuard,
    EquipmentMasterDataSeedService,
    EquipmentCatalogSeedService,
    { provide: GroupRepository, useClass: GroupsRelationalRepository },
    { provide: SubgroupRepository, useClass: SubgroupsRelationalRepository },
    { provide: CategoryRepository, useClass: CategoriesRelationalRepository },
    { provide: EquipmentRepository, useClass: EquipmentRelationalRepository },
  ],
  controllers: [EquipmentController],
  exports: [EquipmentService],
})
export class EquipmentModule {
  static registerAsync(options: EquipmentModuleAsyncOptions): DynamicModule {
    const optionsProvider: Provider = { provide: EQUIPMENT_MODULE_OPTIONS, useFactory: options.useFactory, inject: options.inject ?? [] };
    return { module: EquipmentModule, imports: options.imports ?? [], providers: [optionsProvider] };
  }
}
