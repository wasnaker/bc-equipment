"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryEntity = exports.SubgroupEntity = exports.GroupEntity = exports.moduleEntities = exports.EQUIPMENT_ENTITIES = void 0;
const group_entity_1 = require("./infrastructure/persistence/relational/entities/group.entity");
Object.defineProperty(exports, "GroupEntity", { enumerable: true, get: function () { return group_entity_1.GroupEntity; } });
const subgroup_entity_1 = require("./infrastructure/persistence/relational/entities/subgroup.entity");
Object.defineProperty(exports, "SubgroupEntity", { enumerable: true, get: function () { return subgroup_entity_1.SubgroupEntity; } });
const category_entity_1 = require("./infrastructure/persistence/relational/entities/category.entity");
Object.defineProperty(exports, "CategoryEntity", { enumerable: true, get: function () { return category_entity_1.CategoryEntity; } });
/** Entity metadata owned by this module; register with the host TypeORM DataSource. */
exports.EQUIPMENT_ENTITIES = [group_entity_1.GroupEntity, subgroup_entity_1.SubgroupEntity, category_entity_1.CategoryEntity];
/** Standard package contract consumed by the host's generated registry. */
exports.moduleEntities = exports.EQUIPMENT_ENTITIES;
