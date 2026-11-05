import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import {
  useGetGroupsService, useGetGroupService, useCreateGroupService, useUpdateGroupService, useDeleteGroupService,
  useGetSubgroupsService, useGetSubgroupService, useCreateSubgroupService, useUpdateSubgroupService, useDeleteSubgroupService,
  useGetCategoriesService, useGetCategoryService, useCreateCategoryService, useUpdateCategoryService, useDeleteCategoryService,
  useGetEquipmentItemsService, useGetEquipmentItemService, useCreateEquipmentItemService, useUpdateEquipmentItemService, useDeleteEquipmentItemService,
} from "../services/equipment-api";
import type { Group, Subgroup, Category, EquipmentItem } from "../types/equipment";
import type { GroupListResponse, SubgroupListResponse, CategoryListResponse, EquipmentItemListResponse } from "../services/equipment-api";
import { useTable } from "@/core/table/use-table";
import { SortEnum } from "@/services/api/types/sort-type";

function unwrapResponse<T>(response: { status: number; data: unknown }): T {
  if (response.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
    const error = response.data as { errors?: Record<string, string> };
    throw new Error(Object.values(error.errors ?? {}).join(", "));
  }
  if (response.data == null) throw new Error("The API returned an empty response");
  return response.data as T;
}

export function useGroups(page = 1, limit = 10, filters?: Record<string, string | number | boolean>) {
  const service = useGetGroupsService();
  return useQuery({
    queryKey: ["equipment", "groups", page, limit, filters],
    queryFn: async () => unwrapResponse<GroupListResponse>(await service({ page, limit, filters })),
  });
}

export function useGroupsServerSide() {
  const service = useGetGroupsService();
  return useTable<Group>({
    queryKey: ["equipment", "groups"],
    searchDebounce: 300,
    defaultSort: { field: "name", order: "ASC" },
    fetchFn: async ({ page, limit, search, sort, filters, signal }) => {
      const activeFilters = Object.fromEntries(Object.entries(filters ?? {}).filter(([, value]) => value != null)) as Record<string, string | number | boolean>;
      if (search) activeFilters.search = search;
      const response = await service({
        page, limit,
        filters: Object.keys(activeFilters).length ? activeFilters : undefined,
        sort: sort ? [{ orderBy: sort.field as keyof Group, order: sort.order === "ASC" ? SortEnum.ASC : SortEnum.DESC }] : undefined,
      }, { signal });
      const payload = unwrapResponse<{ data?: Group[]; total?: number }>(response);
      if (typeof payload.total !== "number") throw new Error("Groups API response is missing total");
      return { data: payload.data ?? [], total: payload.total };
    },
  });
}

export function useGroup(id: Group["id"] | null) {
  const service = useGetGroupService();
  return useQuery({
    queryKey: ["equipment", "group", id],
    queryFn: async () => unwrapResponse<Group>(await service({ id: id as Group["id"] })),
    enabled: id != null,
  });
}

export function useCreateGroup() {
  const service = useCreateGroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => unwrapResponse<Group>(await service(data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipment", "groups"] }),
  });
}

export function useUpdateGroup() {
  const service = useUpdateGroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => unwrapResponse<Group>(await service(data)),
    onSuccess: (_res, vars) => { qc.invalidateQueries({ queryKey: ["equipment", "groups"] }); qc.invalidateQueries({ queryKey: ["equipment", "group", vars.id] }); },
  });
}

export function useDeleteGroup() {
  const service = useDeleteGroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: Group["id"] }) => {
      const response = await service({ id });
      if (response.status !== HTTP_CODES_ENUM.NO_CONTENT) unwrapResponse<undefined>(response);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipment", "groups"] }),
  });
}

export function useSubgroups(groupId: Group["id"] | null, page = 1, limit = 50, filters?: Record<string, string | number | boolean>) {
  const service = useGetSubgroupsService();
  return useQuery({
    queryKey: ["equipment", "subgroups", groupId, page, limit, filters],
    queryFn: async () => unwrapResponse<SubgroupListResponse>(await service({ page, limit, filters: { ...(groupId != null ? { groupId: String(groupId) } : {}), ...(filters ?? {}) } })),
    enabled: groupId !== null,
  });
}

export function useSubgroup(id: Subgroup["id"] | null) {
  const service = useGetSubgroupService();
  return useQuery({
    queryKey: ["equipment", "subgroup", id],
    queryFn: async () => unwrapResponse<Subgroup>(await service({ id: id as Subgroup["id"] })),
    enabled: id != null,
  });
}

export function useSubgroupsQuery() {
  const service = useGetSubgroupsService();
  return useQuery({
    queryKey: ["equipment", "subgroups-query"],
    queryFn: async () => unwrapResponse<SubgroupListResponse>(await service({ page: 1, limit: 100 })),
  });
}

export function useCreateSubgroup() {
  const service = useCreateSubgroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => unwrapResponse<Subgroup>(await service(data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipment", "subgroups"] }),
  });
}

export function useUpdateSubgroup() {
  const service = useUpdateSubgroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => unwrapResponse<Subgroup>(await service(data)),
    onSuccess: (_res, vars) => { qc.invalidateQueries({ queryKey: ["equipment", "subgroups"] }); qc.invalidateQueries({ queryKey: ["equipment", "subgroup", vars.id] }); },
  });
}

export function useDeleteSubgroup() {
  const service = useDeleteSubgroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: Subgroup["id"] }) => {
      const response = await service({ id });
      if (response.status !== HTTP_CODES_ENUM.NO_CONTENT) unwrapResponse<undefined>(response);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipment", "subgroups"] }),
  });
}

export function useSubgroupsServerSide() {
  const service = useGetSubgroupsService();
  return useTable<Subgroup>({
    queryKey: ["equipment", "subgroups"],
    searchDebounce: 300,
    defaultSort: { field: "name", order: "ASC" },
    fetchFn: async ({ page, limit, search, sort, filters, signal }) => {
      const activeFilters = Object.fromEntries(Object.entries(filters ?? {}).filter(([, value]) => value != null)) as Record<string, string | number | boolean>;
      if (search) activeFilters.search = search;
      const response = await service({
        page, limit,
        filters: Object.keys(activeFilters).length ? activeFilters : undefined,
        sort: sort ? [{ orderBy: sort.field as keyof Subgroup, order: sort.order === "ASC" ? SortEnum.ASC : SortEnum.DESC }] : undefined,
      }, { signal });
      const payload = unwrapResponse<{ data?: Subgroup[]; total?: number }>(response);
      if (typeof payload.total !== "number") throw new Error("Subgroups API response is missing total");
      return { data: payload.data ?? [], total: payload.total };
    },
  });
}

export function useCategories(subgroupId: Subgroup["id"] | null, page = 1, limit = 50) {
  const service = useGetCategoriesService();
  return useQuery({
    queryKey: ["equipment", "categories", subgroupId, page, limit],
    queryFn: async () => unwrapResponse<CategoryListResponse>(await service({ page, limit, filters: subgroupId != null ? { subgroupId: String(subgroupId) } : undefined })),
    enabled: subgroupId != null,
  });
}

export function useCategoriesServerSide() {
  const service = useGetCategoriesService();
  return useTable<Category>({
    queryKey: ["equipment", "categories"],
    searchDebounce: 300,
    defaultSort: { field: "name", order: "ASC" },
    fetchFn: async ({ page, limit, search, sort, filters, signal }) => {
      const activeFilters = Object.fromEntries(Object.entries(filters ?? {}).filter(([, value]) => value != null)) as Record<string, string | number | boolean>;
      if (search) activeFilters.search = search;
      const response = await service({
        page, limit,
        filters: Object.keys(activeFilters).length ? activeFilters : undefined,
        sort: sort ? [{ orderBy: sort.field as keyof Category, order: sort.order === "ASC" ? SortEnum.ASC : SortEnum.DESC }] : undefined,
      }, { signal });
      const payload = unwrapResponse<{ data?: Category[]; total?: number }>(response);
      if (typeof payload.total !== "number") throw new Error("Categories API response is missing total");
      return { data: payload.data ?? [], total: payload.total };
    },
  });
}

export function useCategory(id: Category["id"] | null) {
  const service = useGetCategoryService();
  return useQuery({
    queryKey: ["equipment", "category", id],
    queryFn: async () => unwrapResponse<Category>(await service({ id: id as Category["id"] })),
    enabled: id != null,
  });
}

export function useCategoriesQuery() {
  const service = useGetCategoriesService();
  return useQuery({
    queryKey: ["equipment", "categories-query"],
    queryFn: async () => unwrapResponse<CategoryListResponse>(await service({ page: 1, limit: 100 })),
  });
}

export function useCreateCategory() {
  const service = useCreateCategoryService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => unwrapResponse<Category>(await service(data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipment", "categories"] }),
  });
}

export function useUpdateCategory() {
  const service = useUpdateCategoryService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => unwrapResponse<Category>(await service(data)),
    onSuccess: (_res, vars) => { qc.invalidateQueries({ queryKey: ["equipment", "categories"] }); qc.invalidateQueries({ queryKey: ["equipment", "category", vars.id] }); },
  });
}

export function useDeleteCategory() {
  const service = useDeleteCategoryService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: Category["id"] }) => {
      const response = await service({ id });
      if (response.status !== HTTP_CODES_ENUM.NO_CONTENT) unwrapResponse<undefined>(response);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipment", "categories"] }),
  });
}

// ── Equipment items (types) ──────────────────────────────────────────────

export function useEquipmentItems(categoryId: Category["id"] | null, page = 1, limit = 50) {
  const service = useGetEquipmentItemsService();
  return useQuery({
    queryKey: ["equipment", "items", categoryId, page, limit],
    queryFn: async () => {
      const res = await service({ page, limit, filters: categoryId != null ? { categoryId: Number(categoryId) } : undefined });
      const parsed = unwrapResponse<EquipmentItemListResponse>(res);
      return parsed;
    },
    enabled: categoryId != null,
  });
}

export function useEquipmentItemsServerSide(categoryId: Category["id"] | null) {
  const service = useGetEquipmentItemsService();
  return useTable<EquipmentItem>({
    queryKey: ["equipment", "items", categoryId],
    searchDebounce: 300,
    defaultSort: { field: "name", order: "ASC" },
    fetchFn: async ({ page, limit, search, sort, filters, signal }) => {
      const activeFilters = Object.fromEntries(Object.entries(filters ?? {}).filter(([, value]) => value != null)) as Record<string, string | number | boolean>;
      if (categoryId != null) activeFilters.categoryId = categoryId;
      if (search) activeFilters.search = search;
      const response = await service({
        page, limit,
        filters: Object.keys(activeFilters).length ? activeFilters : undefined,
        sort: sort ? [{ orderBy: sort.field as keyof EquipmentItem, order: sort.order === "ASC" ? SortEnum.ASC : SortEnum.DESC }] : undefined,
      }, { signal });
      const payload = unwrapResponse<{ data?: EquipmentItem[]; total?: number }>(response);
      if (typeof payload.total !== "number") throw new Error("Items API response is missing total");
      return { data: payload.data ?? [], total: payload.total };
    },
  });
}

export function useCreateEquipmentItem() {
  const service = useCreateEquipmentItemService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => unwrapResponse<EquipmentItem>(await service(data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipment", "items"] }),
  });
}

export function useUpdateEquipmentItem() {
  const service = useUpdateEquipmentItemService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => unwrapResponse<EquipmentItem>(await service(data)),
    onSuccess: (_res, vars) => { qc.invalidateQueries({ queryKey: ["equipment", "items"] }); qc.invalidateQueries({ queryKey: ["equipment", "item", vars.id] }); },
  });
}

export function useDeleteEquipmentItem() {
  const service = useDeleteEquipmentItemService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: EquipmentItem["id"] }) => {
      const response = await service({ id });
      if (response.status !== HTTP_CODES_ENUM.NO_CONTENT) unwrapResponse<undefined>(response);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipment", "items"] }),
  });
}
