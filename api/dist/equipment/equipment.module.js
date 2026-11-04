"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EquipmentModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentModule = exports.EQUIPMENT_MODULE_OPTIONS = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const group_entity_1 = require("./infrastructure/persistence/relational/entities/group.entity");
const subgroup_entity_1 = require("./infrastructure/persistence/relational/entities/subgroup.entity");
const category_entity_1 = require("./infrastructure/persistence/relational/entities/category.entity");
const equipment_service_1 = require("./services/equipment.service");
const equipment_controller_1 = require("./controllers/equipment.controller");
const group_repository_1 = require("./infrastructure/persistence/group.repository");
const subgroup_repository_1 = require("./infrastructure/persistence/subgroup.repository");
const group_repository_2 = require("./infrastructure/persistence/relational/repositories/group.repository");
const subgroup_repository_2 = require("./infrastructure/persistence/relational/repositories/subgroup.repository");
const category_repository_1 = require("./infrastructure/persistence/category.repository");
const category_repository_2 = require("./infrastructure/persistence/relational/repositories/category.repository");
const equipment_access_guard_1 = require("./security/equipment-access.guard");
const equipment_options_1 = require("./equipment.options");
var equipment_options_2 = require("./equipment.options");
Object.defineProperty(exports, "EQUIPMENT_MODULE_OPTIONS", { enumerable: true, get: function () { return equipment_options_2.EQUIPMENT_MODULE_OPTIONS; } });
let EquipmentModule = EquipmentModule_1 = class EquipmentModule {
    static registerAsync(options) {
        const optionsProvider = {
            provide: equipment_options_1.EQUIPMENT_MODULE_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject ?? [],
        };
        return { module: EquipmentModule_1, imports: options.imports ?? [], providers: [optionsProvider] };
    }
};
exports.EquipmentModule = EquipmentModule;
exports.EquipmentModule = EquipmentModule = EquipmentModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([group_entity_1.GroupEntity, subgroup_entity_1.SubgroupEntity, category_entity_1.CategoryEntity])],
        providers: [
            equipment_service_1.EquipmentService,
            equipment_access_guard_1.EquipmentAccessGuard,
            { provide: group_repository_1.GroupRepository, useClass: group_repository_2.GroupsRelationalRepository },
            { provide: subgroup_repository_1.SubgroupRepository, useClass: subgroup_repository_2.SubgroupsRelationalRepository },
            { provide: category_repository_1.CategoryRepository, useClass: category_repository_2.CategoriesRelationalRepository },
        ],
        controllers: [equipment_controller_1.EquipmentController],
        exports: [equipment_service_1.EquipmentService],
    })
], EquipmentModule);
