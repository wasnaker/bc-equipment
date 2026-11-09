import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common';
import { EQUIPMENT_MODULE_OPTIONS, EquipmentModuleOptions } from '../equipment.options';

interface AuthenticatedRequest {
  method: string;
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

    // Equipment master data is global, but module Roles are still required to
    // have a current Core-managed permission grant and at least one active
    // assigned scope. A bare Role ID is never sufficient authorization.
    const resolved = await this.options.resolveScopes(userId, permission);
    if (!resolved.global && resolved.scopes.length === 0) {
      throw new ForbiddenException();
    }
    return true;
  }
}
