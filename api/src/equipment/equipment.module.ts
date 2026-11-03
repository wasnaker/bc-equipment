import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './infrastructure/persistence/relational/entities/group.entity';
import { SubgroupEntity } from './infrastructure/persistence/relational/entities/subgroup.entity';
import { EquipmentService } from './services/equipment.service';
import { EquipmentController } from './controllers/equipment.controller';
import { GroupRepository } from './infrastructure/persistence/group.repository';
import { SubgroupRepository } from './infrastructure/persistence/subgroup.repository';
import { GroupsRelationalRepository } from './infrastructure/persistence/relational/repositories/group.repository';
import { RegenciesRelationalRepository } from './infrastructure/persistence/relational/repositories/subgroup.repository';
import { EquipmentAccessGuard } from './security/equipment-access.guard';
import { EQUIPMENT_MODULE_OPTIONS, EquipmentModuleAsyncOptions } from './equipment.options';
export { EQUIPMENT_MODULE_OPTIONS } from './equipment.options';
export type { EquipmentModuleOptions, EquipmentModuleAsyncOptions } from './equipment.options';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, SubgroupEntity])],
  providers: [
    EquipmentService,
    EquipmentAccessGuard,
    { provide: GroupRepository, useClass: GroupsRelationalRepository },
    { provide: SubgroupRepository, useClass: RegenciesRelationalRepository },
  ],
  controllers: [EquipmentController],
  exports: [EquipmentService],
})
export class EquipmentModule {
  static registerAsync(options: EquipmentModuleAsyncOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: EQUIPMENT_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? [],
    };

    return {
      module: EquipmentModule,
      imports: options.imports ?? [],
      providers: [optionsProvider],
    };
  }
}
