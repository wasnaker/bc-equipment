import { CreateEquipmentHierarchy1793710214000000001 } from './1793710214000000001-CreateEquipmentHierarchy';
import { CreateEquipmentCategory1793710215000000000 } from './1793710215000000000-CreateEquipmentCategory';
import { CreateEquipmentMaster1793710216000000000 } from './1793710216000000000-CreateEquipmentMaster';

export { CreateEquipmentHierarchy1793710214000000001 };
export { CreateEquipmentCategory1793710215000000000 };
export { CreateEquipmentMaster1793710216000000000 };

export const moduleMigrations = [
  CreateEquipmentHierarchy1793710214000000001,
  CreateEquipmentCategory1793710215000000000,
  CreateEquipmentMaster1793710216000000000,
] as const;
