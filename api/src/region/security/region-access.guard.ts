import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common';
import { REGION_MODULE_OPTIONS, RegionModuleOptions } from '../region.options';

interface AuthenticatedRequest {
  method: string;
  user?: { role?: { id?: number | string } };
}

const PERMISSION_BY_METHOD: Record<string, string> = {
  GET: 'read:region',
  HEAD: 'read:region',
  POST: 'create:region',
  PATCH: 'update:region',
  PUT: 'update:region',
  DELETE: 'delete:region',
};

@Injectable()
export class RegionAccessGuard implements CanActivate {
  constructor(
    @Optional()
    @Inject(REGION_MODULE_OPTIONS)
    private readonly options?: RegionModuleOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const permission = PERMISSION_BY_METHOD[request.method.toUpperCase()];
    const roleId = request.user?.role?.id;

    if (!permission || roleId === undefined || !this.options?.authorize) {
      throw new ForbiddenException();
    }

    const allowed = await this.options.authorize(roleId, permission);
    if (!allowed) throw new ForbiddenException();
    return true;
  }
}
