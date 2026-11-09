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
exports.EquipmentAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const equipment_options_1 = require("../equipment.options");
const PERMISSION_BY_METHOD = {
    GET: 'read:equipment',
    HEAD: 'read:equipment',
    POST: 'create:equipment',
    PATCH: 'update:equipment',
    PUT: 'update:equipment',
    DELETE: 'delete:equipment',
};
let EquipmentAccessGuard = class EquipmentAccessGuard {
    constructor(options) {
        this.options = options;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (this.options?.isModuleActive && !(await this.options.isModuleActive())) {
            throw new common_1.ForbiddenException('Equipment module is inactive');
        }
        const permission = PERMISSION_BY_METHOD[request.method.toUpperCase()];
        const roleIds = [
            ...new Set((request.user?.roles ?? [])
                .map((role) => role.id)
                .filter((id) => id !== undefined && id !== null)),
        ];
        if (!permission || roleIds.length === 0 || !this.options?.authorize) {
            throw new common_1.ForbiddenException();
        }
        let allowed = false;
        for (const roleId of roleIds) {
            if (await this.options.authorize(roleId, permission)) {
                allowed = true;
                break;
            }
        }
        if (!allowed)
            throw new common_1.ForbiddenException();
        return true;
    }
};
exports.EquipmentAccessGuard = EquipmentAccessGuard;
exports.EquipmentAccessGuard = EquipmentAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(equipment_options_1.EQUIPMENT_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], EquipmentAccessGuard);
