"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentMasterDataSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const equipment_master_data_sql_1 = require("./equipment-master-data.sql");
/**
 * Seeds the canonical K3 equipment classification (6 groups, 20 subgroups).
 *
 * Idempotent by natural key. Existing records are retained; only missing
 * classification metadata is filled, so repeated host seed runs do not
 * overwrite user-maintained names, descriptions, status, or custom ordering.
 */
let EquipmentMasterDataSeedService = class EquipmentMasterDataSeedService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async run() {
        await this.dataSource.transaction(async (manager) => {
            await manager.query(equipment_master_data_sql_1.EQUIPMENT_MASTER_DATA_SQL);
        });
    }
};
exports.EquipmentMasterDataSeedService = EquipmentMasterDataSeedService;
exports.EquipmentMasterDataSeedService = EquipmentMasterDataSeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(typeorm_1.DataSource)),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], EquipmentMasterDataSeedService);
