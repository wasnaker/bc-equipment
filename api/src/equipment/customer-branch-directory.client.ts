import {
  Inject,
  Injectable,
} from "@nestjs/common";

export interface CustomerBranchSummary {
  id: string;
  customerId: string;
  name: string;
  isHeadOffice: boolean;
  isActive: boolean;
}

export interface CustomerBranchDirectory {
  findBranchById(id: string): Promise<CustomerBranchSummary | null>;
}

interface ModuleServiceRegistry {
  resolve<TService>(
    consumerModuleId: string,
    contractId: string,
    requiredVersion: string,
  ): TService;
}

const MODULE_SERVICE_REGISTRY = Symbol.for(
  "@wasnaker/module-runtime/service-registry",
);

/**
 * Equipment consumes only Customer's public branch read contract. It does not
 * import Customer's service, repository, or entity implementation.
 */
@Injectable()
export class CustomerBranchDirectoryClient {

  constructor(
    @Inject(MODULE_SERVICE_REGISTRY)
    private readonly registry: ModuleServiceRegistry,
  ) {}

  findBranchById(id: string): Promise<CustomerBranchSummary | null> {
    const directory = this.registry.resolve<CustomerBranchDirectory>(
      "equipment",
      "customer.branch-directory",
      "^1.0.0",
    );
    return directory.findBranchById(id);
  }
}
