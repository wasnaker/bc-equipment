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
  user?: { role?: { id?: number | string } };
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
