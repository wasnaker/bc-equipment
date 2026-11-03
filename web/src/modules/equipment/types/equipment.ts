// Group — wilayah level 1 di Indonesia
export interface Group {
  id: number | string;
  name: string;
  isoCode: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

// Subgroup — wilayah level 2 (kabupaten / kota), child dari Group
export interface Subgroup {
  id: number | string;
  groupId: number | string;
  name: string;
  type: "kabupaten" | "kota";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const SUBGROUP_TYPES = [
  { value: "kabupaten" as const, label: "Kabupaten" },
  { value: "kota" as const, label: "Kota" },
];
