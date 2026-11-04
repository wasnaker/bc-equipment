import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import {
  useGetGroupsService, useGetGroupService, useCreateGroupService, useUpdateGroupService, useDeleteGroupService,
  useGetSubgroupsService, useGetSubgroupService, useCreateSubgroupService, useUpdateSubgroupService, useDeleteSubgroupService,
} from "../services/equipment-api";
import type { Group, Subgroup } from "../types/equipment";
import { useTable } from "@/core/table/use-table";
import { SortEnum } from "@/services/api/types/sort-type";

function throwIfApiError(res: { status: number; data?: { errors?: Record<string, string> } }, fallback: string) {
  if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
    throw new Error(Object.values(res.data?.errors ?? {}).join(", "));
  }
  if (!res.data) throw new Error(fallback);
}

export function useGroups(page = 1, limit = 10, filters?: Record<string, string | number | boolean>) {
  const service = useGetGroupsService();
  return useQuery({
    queryKey: ["equipment", "groups", page, limit, filters],
    queryFn: async () => {
      const res = await service({ page, limit, filters });
      throwIfApiError(res, "Failed to load groups");
      return res.data;
    },
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
      const res = await service({
        page, limit,
        filters: Object.keys(activeFilters).length ? activeFilters : undefined,
        sort: sort ? [{ orderBy: sort.field as keyof Group, order: sort.order === "ASC" ? SortEnum.ASC : SortEnum.DESC }] : undefined,
      }, { signal });
      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) throw new Error(Object.values(res.data?.errors ?? {}).join(", "));
      if (res.status !== HTTP_CODES_ENUM.OK || !res.data) throw new Error("Failed to load groups");
      const response = res.data as { data?: Group[]; total?: number };
      if (typeof response.total !== "number") throw new Error("Groups API response is missing total");
      return { data: response.data ?? [], total: response.total };
    },
  });
}

export function useGroup(id: Group["id"] | null) {
  const service = useGetGroupService();
  return useQuery({
    queryKey: ["equipment", "group", id],
    queryFn: async () => { const res = await service({ id: id as Group["id"] }); throwIfApiError(res, "Failed to load group"); return res.data; },
    enabled: id != null,
  });
}

export function useCreateGroup() {
  const service = useCreateGroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => { const res = await service(data); throwIfApiError(res, "Failed to create group"); return res.data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipment", "groups"] }),
  });
}

export function useUpdateGroup() {
  const service = useUpdateGroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => { const res = await service(data); throwIfApiError(res, "Failed to update group"); return res.data; },
    onSuccess: (_res, vars) => { qc.invalidateQueries({ queryKey: ["equipment", "groups"] }); qc.invalidateQueries({ queryKey: ["equipment", "group", vars.id] }); },
  });
}

export function useDeleteGroup() {
  const service = useDeleteGroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: Group["id"] }) => { const res = await service({ id }); if (res.status !== HTTP_CODES_ENUM.NO_CONTENT) throw new Error("Failed to delete group"); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["equipment", "groups"] }); qc.invalidateQueries({ queryKey: ["equipment", "subgroups"] }); },
  });
}

export function useSubgroups(groupId: Group["id"] | null, page = 1, limit = 10) {
  const service = useGetSubgroupsService();
  return useQuery({
    queryKey: ["equipment", "subgroups", groupId, page, limit],
    queryFn: async () => { const res = await service({ page, limit, filters: groupId != null ? { groupId: String(groupId) } : undefined }); throwIfApiError(res, "Failed to load subgroups"); return res.data; },
    enabled: groupId != null,
  });
}

export function useSubgroup(id: Subgroup["id"] | null) {
  const service = useGetSubgroupService();
  return useQuery({
    queryKey: ["equipment", "subgroup", id],
    queryFn: async () => { const res = await service({ id: id as Subgroup["id"] }); throwIfApiError(res, "Failed to load subgroup"); return res.data; },
    enabled: id != null,
  });
}

export function useCreateSubgroup() {
  const service = useCreateSubgroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => { const res = await service(data); throwIfApiError(res, "Failed to create subgroup"); return res.data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipment", "subgroups"] }),
  });
}

export function useUpdateSubgroup() {
  const service = useUpdateSubgroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => { const res = await service(data); throwIfApiError(res, "Failed to update subgroup"); return res.data; },
    onSuccess: (_res, vars) => { qc.invalidateQueries({ queryKey: ["equipment", "subgroups"] }); qc.invalidateQueries({ queryKey: ["equipment", "subgroup", vars.id] }); },
  });
}

export function useDeleteSubgroup() {
  const service = useDeleteSubgroupService(); const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: Subgroup["id"] }) => { const res = await service({ id }); if (res.status !== HTTP_CODES_ENUM.NO_CONTENT) throw new Error("Failed to delete subgroup"); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipment", "subgroups"] }),
  });
}
