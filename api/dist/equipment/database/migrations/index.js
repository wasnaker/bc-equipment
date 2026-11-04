"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleMigrations = exports.CreateEquipmentCategory1793710215000000000 = exports.CreateEquipmentHierarchy1793710214000000001 = void 0;
const _1793710214000000001_CreateEquipmentHierarchy_1 = require("./1793710214000000001-CreateEquipmentHierarchy");
Object.defineProperty(exports, "CreateEquipmentHierarchy1793710214000000001", { enumerable: true, get: function () { return _1793710214000000001_CreateEquipmentHierarchy_1.CreateEquipmentHierarchy1793710214000000001; } });
const _1793710215000000000_CreateEquipmentCategory_1 = require("./1793710215000000000-CreateEquipmentCategory");
Object.defineProperty(exports, "CreateEquipmentCategory1793710215000000000", { enumerable: true, get: function () { return _1793710215000000000_CreateEquipmentCategory_1.CreateEquipmentCategory1793710215000000000; } });
/** Standard package contract consumed by the host's generated registry. */
exports.moduleMigrations = [
    _1793710214000000001_CreateEquipmentHierarchy_1.CreateEquipmentHierarchy1793710214000000001,
    _1793710215000000000_CreateEquipmentCategory_1.CreateEquipmentCategory1793710215000000000,
];
