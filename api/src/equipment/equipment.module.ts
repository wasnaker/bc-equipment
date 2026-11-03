import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceEntity } from './infrastructure/persistence/relational/entities/province.entity';
import { RegencyEntity } from './infrastructure/persistence/relational/entities/regency.entity';
import { EquipmentService } from './services/equipment.service';
import { EquipmentController } from './controllers/equipment.controller';
import { EquipmentSeedService } from './database/equipment-seed.service';
import { ProvinceRepository } from './infrastructure/persistence/province.repository';
import { RegencyRepository } from './infrastructure/persistence/regency.repository';
import { ProvincesRelationalRepository } from './infrastructure/persistence/relational/repositories/province.repository';
import { RegenciesRelationalRepository } from './infrastructure/persistence/relational/repositories/regency.repository';
import { EquipmentAccessGuard } from './security/equipment-access.guard';
import { EQUIPMENT_MODULE_OPTIONS, EquipmentModuleAsyncOptions } from './equipment.options';
export { EQUIPMENT_MODULE_OPTIONS } from './equipment.options';
export type { EquipmentModuleOptions, EquipmentModuleAsyncOptions } from './equipment.options';

@Module({
  imports: [TypeOrmModule.forFeature([ProvinceEntity, RegencyEntity])],
  providers: [
    EquipmentService,
    EquipmentSeedService,
    EquipmentAccessGuard,
    { provide: ProvinceRepository, useClass: ProvincesRelationalRepository },
    { provide: RegencyRepository, useClass: RegenciesRelationalRepository },
  ],
  controllers: [EquipmentController],
  exports: [EquipmentService, EquipmentSeedService],
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
