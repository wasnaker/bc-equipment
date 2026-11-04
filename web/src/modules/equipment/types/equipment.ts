export interface Group {
  id: number | string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subgroup {
  id: number | string;
  groupId: number | string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number | string;
  subgroupId: number | string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentItem {
  id: number | string;
  ulid: string;
  code: string;
  subgroupId: number | string;
  categoryId: number | string | null;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
