"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RegionModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionModule = exports.REGION_MODULE_OPTIONS = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const province_entity_1 = require("./infrastructure/persistence/relational/entities/province.entity");
const regency_entity_1 = require("./infrastructure/persistence/relational/entities/regency.entity");
const region_service_1 = require("./services/region.service");
const region_controller_1 = require("./controllers/region.controller");
const region_seed_service_1 = require("./database/region-seed.service");
const province_repository_1 = require("./infrastructure/persistence/province.repository");
const regency_repository_1 = require("./infrastructure/persistence/regency.repository");
const province_repository_2 = require("./infrastructure/persistence/relational/repositories/province.repository");
const regency_repository_2 = require("./infrastructure/persistence/relational/repositories/regency.repository");
const region_access_guard_1 = require("./security/region-access.guard");
const region_options_1 = require("./region.options");
var region_options_2 = require("./region.options");
Object.defineProperty(exports, "REGION_MODULE_OPTIONS", { enumerable: true, get: function () { return region_options_2.REGION_MODULE_OPTIONS; } });
let RegionModule = RegionModule_1 = class RegionModule {
    static registerAsync(options) {
        const optionsProvider = {
            provide: region_options_1.REGION_MODULE_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject ?? [],
        };
        return {
            module: RegionModule_1,
            imports: options.imports ?? [],
            providers: [optionsProvider],
        };
    }
};
exports.RegionModule = RegionModule;
exports.RegionModule = RegionModule = RegionModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([province_entity_1.ProvinceEntity, regency_entity_1.RegencyEntity])],
        providers: [
            region_service_1.RegionService,
            region_seed_service_1.RegionSeedService,
            region_access_guard_1.RegionAccessGuard,
            { provide: province_repository_1.ProvinceRepository, useClass: province_repository_2.ProvincesRelationalRepository },
            { provide: regency_repository_1.RegencyRepository, useClass: regency_repository_2.RegenciesRelationalRepository },
        ],
        controllers: [region_controller_1.RegionController],
        exports: [region_service_1.RegionService, region_seed_service_1.RegionSeedService],
    })
], RegionModule);
