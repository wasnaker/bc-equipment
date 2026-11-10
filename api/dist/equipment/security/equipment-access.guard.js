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
const customer_branch_directory_client_1 = require("../customer-branch-directory.client");
const PERMISSION_BY_METHOD = {
    GET: 'read:equipment',
    HEAD: 'read:equipment',
    POST: 'create:equipment',
    PATCH: 'update:equipment',
    PUT: 'update:equipment',
    DELETE: 'delete:equipment',
};
let EquipmentAccessGuard = class EquipmentAccessGuard {
    constructor(options, customerBranches) {
        this.options = options;
        this.customerBranches = customerBranches;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (this.options?.isModuleActive && !(await this.options.isModuleActive())) {
            throw new common_1.ForbiddenException('Equipment module is inactive');
        }
        const permission = PERMISSION_BY_METHOD[request.method.toUpperCase()];
        const userId = request.user?.id;
        if (userId === undefined || userId === null || !permission || !this.options?.resolveScopes) {
            throw new common_1.ForbiddenException();
        }
        // The branch-context endpoint is resource-scoped; verify the exact branch
        // rather than accepting any branch assignment. Other Equipment master
        // data is global but still requires at least one active Core-resolved scope.
        const branchId = request.params?.branchId;
        if (branchId) {
            if (!this.options.authorizeScoped || !this.customerBranches) {
                throw new common_1.ForbiddenException();
            }
            let branch;
            try {
                branch = await this.customerBranches.findBranchById(String(branchId));
            }
            catch {
                throw new common_1.ForbiddenException();
            }
            if (!branch || !branch.isActive)
                throw new common_1.ForbiddenException();
            const allowed = await this.options.authorizeScoped(userId, permission, {
                scopes: [
                    { type: 'branch', id: branch.id },
                    { type: 'customer', id: branch.customerId },
                ],
            });
            if (!allowed)
                throw new common_1.ForbiddenException();
            return true;
        }
        const resolved = await this.options.resolveScopes(userId, permission);
        if (!resolved.global && resolved.scopes.length === 0) {
            throw new common_1.ForbiddenException();
        }
        return true;
    }
};
exports.EquipmentAccessGuard = EquipmentAccessGuard;
exports.EquipmentAccessGuard = EquipmentAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(equipment_options_1.EQUIPMENT_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object, customer_branch_directory_client_1.CustomerBranchDirectoryClient])
], EquipmentAccessGuard);
