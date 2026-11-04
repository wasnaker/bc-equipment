import { CreateEquipmentHierarchy1793710214000000001 } from './1793710214000000001-CreateEquipmentHierarchy';
import { CreateEquipmentCategory1793710215000000000 } from './1793710215000000000-CreateEquipmentCategory';

export { CreateEquipmentHierarchy1793710214000000001 };
export { CreateEquipmentCategory1793710215000000000 };

/** Standard package contract consumed by the host's generated registry. */
export const moduleMigrations = [
  CreateEquipmentHierarchy1793710214000000001,
  CreateEquipmentCategory1793710215000000000,
] as const;
