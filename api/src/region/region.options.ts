import type { DynamicModule } from '@nestjs/common';

export interface RegionModuleOptions {
  /** Delegate permission decisions to the host's authorization service. */
  authorize: (
    roleId: number | string,
    permission: string,
  ) => boolean | Promise<boolean>;
}

export interface RegionModuleAsyncOptions {
  imports?: DynamicModule['imports'];
  inject?: any[];
  useFactory: (...dependencies: any[]) =>
    | RegionModuleOptions
    | Promise<RegionModuleOptions>;
}

export const REGION_MODULE_OPTIONS = Symbol.for('@wasnaker/module-region/options');
