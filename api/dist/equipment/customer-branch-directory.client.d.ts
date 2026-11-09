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
    resolve<TService>(consumerModuleId: string, contractId: string, requiredVersion: string): TService;
}
/**
 * Equipment consumes only Customer's public branch read contract. It does not
 * import Customer's service, repository, or entity implementation.
 */
export declare class CustomerBranchDirectoryClient {
    private readonly registry;
    constructor(registry: ModuleServiceRegistry);
    findBranchById(id: string): Promise<CustomerBranchSummary | null>;
}
export {};
