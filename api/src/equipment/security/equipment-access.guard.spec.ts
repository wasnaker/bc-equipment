import { ForbiddenException } from '@nestjs/common';
import { EquipmentAccessGuard } from './equipment-access.guard';

describe('EquipmentAccessGuard Core scope authorization', () => {
  const resolveScopes = jest.fn();
  const authorizeScoped = jest.fn();
  const isModuleActive = jest.fn();
  const guard = new EquipmentAccessGuard({ resolveScopes, authorizeScoped, isModuleActive } as never);
  const execute = (method: string, user: Record<string, unknown>, params: Record<string, string> = {}) => {
    const context = {
      switchToHttp: () => ({ getRequest: () => ({ method, user, params }) }),
    };
    return guard.canActivate(context as never);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    isModuleActive.mockResolvedValue(true);
    resolveScopes.mockResolvedValue({ global: false, scopes: [{ type: 'branch', id: '42' }] });
    authorizeScoped.mockResolvedValue(true);
  });

  it('allows a module permission only when Core resolves an active assignment scope', async () => {
    await expect(execute('GET', { id: 7, roles: [{ id: 10 }] })).resolves.toBe(true);
    expect(resolveScopes).toHaveBeenCalledWith(7, 'read:equipment');
  });

  it('checks the exact branch for the Customer Branch context route', async () => {
    await expect(execute('GET', { id: 7, roles: [{ id: 10 }] }, { branchId: '42' })).resolves.toBe(true);
    expect(authorizeScoped).toHaveBeenCalledWith(
      7,
      'read:equipment',
      { scopes: [{ type: 'branch', id: '42' }] },
    );
    expect(resolveScopes).not.toHaveBeenCalled();
  });

  it('fails closed when no active scope is resolved', async () => {
    resolveScopes.mockResolvedValue({ global: false, scopes: [] });
    await expect(execute('GET', { id: 7, roles: [{ id: 10 }] })).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('fails closed when the module is inactive', async () => {
    isModuleActive.mockResolvedValue(false);
    await expect(execute('GET', { id: 7, roles: [{ id: 10 }] })).rejects.toBeInstanceOf(ForbiddenException);
    expect(resolveScopes).not.toHaveBeenCalled();
  });
});
