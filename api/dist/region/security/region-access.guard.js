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
exports.RegionAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const region_options_1 = require("../region.options");
const PERMISSION_BY_METHOD = {
    GET: 'read:region',
    HEAD: 'read:region',
    POST: 'create:region',
    PATCH: 'update:region',
    PUT: 'update:region',
    DELETE: 'delete:region',
};
let RegionAccessGuard = class RegionAccessGuard {
    constructor(options) {
        this.options = options;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const permission = PERMISSION_BY_METHOD[request.method.toUpperCase()];
        const roleId = request.user?.role?.id;
        if (!permission || roleId === undefined || !this.options?.authorize) {
            throw new common_1.ForbiddenException();
        }
        const allowed = await this.options.authorize(roleId, permission);
        if (!allowed)
            throw new common_1.ForbiddenException();
        return true;
    }
};
exports.RegionAccessGuard = RegionAccessGuard;
exports.RegionAccessGuard = RegionAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(region_options_1.REGION_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], RegionAccessGuard);
