"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleMigrations = exports.AddRegencyCode1793710213000000000 = exports.AddRegionUniquenessConstraints1793466257948612618 = exports.CreateRegion1793466257948612617 = void 0;
const _1793466257948612617_CreateRegion_1 = require("./1793466257948612617-CreateRegion");
Object.defineProperty(exports, "CreateRegion1793466257948612617", { enumerable: true, get: function () { return _1793466257948612617_CreateRegion_1.CreateRegion1793466257948612617; } });
const _1793466257948612618_AddRegionUniquenessConstraints_1 = require("./1793466257948612618-AddRegionUniquenessConstraints");
Object.defineProperty(exports, "AddRegionUniquenessConstraints1793466257948612618", { enumerable: true, get: function () { return _1793466257948612618_AddRegionUniquenessConstraints_1.AddRegionUniquenessConstraints1793466257948612618; } });
const _1793710213000000000_AddRegencyCode_1 = require("./1793710213000000000-AddRegencyCode");
Object.defineProperty(exports, "AddRegencyCode1793710213000000000", { enumerable: true, get: function () { return _1793710213000000000_AddRegencyCode_1.AddRegencyCode1793710213000000000; } });
/** Standard package contract consumed by the host's generated registry. */
exports.moduleMigrations = [
    _1793466257948612617_CreateRegion_1.CreateRegion1793466257948612617,
    _1793466257948612618_AddRegionUniquenessConstraints_1.AddRegionUniquenessConstraints1793466257948612618,
    _1793710213000000000_AddRegencyCode_1.AddRegencyCode1793710213000000000,
];
