import { CreateEquipment1793466257948612617 } from './1793466257948612617-CreateEquipment';
import { AddEquipmentUniquenessConstraints1793466257948612618 } from './1793466257948612618-AddEquipmentUniquenessConstraints';
import { AddRegencyCode1793710213000000000 } from './1793710213000000000-AddRegencyCode';
import { ConvertProvinceRegencyToEquipmentGroups1793710214000000000 } from './1793710214000000000-ConvertProvinceRegencyToEquipmentGroups';
import { CreateEquipmentCategory1793710215000000000 } from './1793710215000000000-CreateEquipmentCategory';

export { CreateEquipment1793466257948612617 };
export { AddEquipmentUniquenessConstraints1793466257948612618 };
export { AddRegencyCode1793710213000000000 };
export { ConvertProvinceRegencyToEquipmentGroups1793710214000000000 };
export { CreateEquipmentCategory1793710215000000000 };

/** Standard package contract consumed by the host's generated registry. */
export const moduleMigrations = [
  CreateEquipment1793466257948612617,
  AddEquipmentUniquenessConstraints1793466257948612618,
  AddRegencyCode1793710213000000000,
  ConvertProvinceRegencyToEquipmentGroups1793710214000000000,
  CreateEquipmentCategory1793710215000000000,
] as const;
