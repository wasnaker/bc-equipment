import {
  Inject,
  Injectable,
  OnModuleInit,
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
export class CustomerBranchDirectoryClient implements OnModuleInit {
  private directory?: CustomerBranchDirectory;

  constructor(
    @Inject(MODULE_SERVICE_REGISTRY)
    private readonly registry: ModuleServiceRegistry,
  ) {}

  onModuleInit(): void {
    this.directory = this.registry.resolve<CustomerBranchDirectory>(
      "equipment",
      "customer.branch-directory",
      "^1.0.0",
    );
  }

  findBranchById(id: string): Promise<CustomerBranchSummary | null> {
    if (!this.directory) {
      throw new Error("Customer branch directory service is not initialized");
    }
    return this.directory.findBranchById(id);
  }
}
