import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common';
import { EQUIPMENT_MODULE_OPTIONS, EquipmentModuleOptions } from '../equipment.options';
import { CustomerBranchDirectoryClient } from '../customer-branch-directory.client';

interface AuthenticatedRequest {
  method: string;
  params?: Record<string, string>;
  user?: {
    id?: number | string;
    role?: { id?: number | string } | null;
    roles?: Array<{ id?: number | string }>;
  };
}

const PERMISSION_BY_METHOD: Record<string, string> = {
  GET: 'read:equipment',
  HEAD: 'read:equipment',
  POST: 'create:equipment',
  PATCH: 'update:equipment',
  PUT: 'update:equipment',
  DELETE: 'delete:equipment',
};

@Injectable()
export class EquipmentAccessGuard implements CanActivate {
  constructor(
    @Optional()
    @Inject(EQUIPMENT_MODULE_OPTIONS)
    private readonly options?: EquipmentModuleOptions,
    private readonly customerBranches?: CustomerBranchDirectoryClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (this.options?.isModuleActive && !(await this.options.isModuleActive())) {
      throw new ForbiddenException('Equipment module is inactive');
    }
    const permission = PERMISSION_BY_METHOD[request.method.toUpperCase()];
    const userId = request.user?.id;
    if (userId === undefined || userId === null || !permission || !this.options?.resolveScopes) {
      throw new ForbiddenException();
    }

    // The branch-context endpoint is resource-scoped; verify the exact branch
    // rather than accepting any branch assignment. Other Equipment master
    // data is global but still requires at least one active Core-resolved scope.
    const branchId = request.params?.branchId;
    if (branchId) {
      if (!this.options.authorizeScoped || !this.customerBranches) {
        throw new ForbiddenException();
      }
      let branch;
      try {
        branch = await this.customerBranches.findBranchById(String(branchId));
      } catch {
        throw new ForbiddenException();
      }
      if (!branch || !branch.isActive) throw new ForbiddenException();
      const allowed = await this.options.authorizeScoped(userId, permission, {
        scopes: [
          { type: 'branch', id: branch.id },
          { type: 'customer', id: branch.customerId },
        ],
      });
      if (!allowed) throw new ForbiddenException();
      return true;
    }

    const resolved = await this.options.resolveScopes(userId, permission);
    if (!resolved.global && resolved.scopes.length === 0) {
      throw new ForbiddenException();
    }
    return true;
  }
}
