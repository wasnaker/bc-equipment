import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import {
  useGetGroupsService,
  useGetGroupService,
  useCreateGroupService,
  useUpdateGroupService,
  useDeleteGroupService,
  useGetRegenciesService,
  useGetSubgroupService,
  useCreateSubgroupService,
  useUpdateSubgroupService,
  useDeleteSubgroupService,
} from "../services/equipment-api";
import type { Group, Subgroup } from "../types/equipment";
import { useTable } from "@/core/table/use-table";
import { SortEnum } from "@/services/api/types/sort-type";

// ── Group hooks ─────────────────────────────────────────────────────────

export function useGroups(
  page = 1,
  limit = 10,
  filters?: Record<string, string | number | boolean>
) {
  const service = useGetGroupsService();
  return useQuery({
    queryKey: ["equipment", "groups", page, limit, filters],
    queryFn: async () => {
      const res = await service({ page, limit, filters });
      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        throw new Error(Object.values(res.data.errors).join(", "));
      }
      return res.data;
    },
  });
}

/**
 * Hook server-side untuk groups — menggunakan useTable.
 * Search, filter, sorting, dan pagination diterapkan backend sebelum
 * pagination; total selalu berasal dari hasil count backend.
 */
export function useGroupsServerSide() {
  const service = useGetGroupsService();
  return useTable<Group>({
    queryKey: ["equipment", "groups"],
    // Default page size mengikuti Core Settings.
    searchDebounce: 300,
    defaultSort: { field: "name", order: "ASC" },
    fetchFn: async ({ page, limit, search, sort, filters, signal }) => {
      // Search digabung dengan filter lain, bukan menggantikan filter yang ada.
      const activeFilters = Object.fromEntries(
        Object.entries(filters ?? {}).filter(([, value]) => value != null)
      ) as Record<string, string | number | boolean>;

      if (search) activeFilters.search = search;

      const res = await service(
        {
          page,
          limit,
          filters: Object.keys(activeFilters).length ? activeFilters : undefined,
          sort: sort
            ? [{
                orderBy: sort.field as keyof Group,
                order: sort.order === "ASC" ? SortEnum.ASC : SortEnum.DESC,
              }]
            : undefined,
        },
        { signal }
      );

      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        throw new Error(Object.values(res.data?.errors ?? {}).join(", "));
      }
      if (res.status !== HTTP_CODES_ENUM.OK || !res.data) {
        throw new Error("Gagal memuat data provinsi");
      }

      // Endpoint Equipment mengembalikan total hasil SETELAH filter/search.
      // Jangan mengestimasi total dari hasNextPage karena pagination bisa salah.
      const response = res.data as {
        data?: Group[];
        total?: number;
      };
      if (typeof response.total !== "number") {
        throw new Error("Respons API provinsi tidak menyertakan total hasil");
      }

      return {
        data: response.data ?? [],
        total: response.total,
      };
    },
  });
}

export function useGroup(id: Group["id"] | null) {
  const service = useGetGroupService();
  return useQuery({
    queryKey: ["equipment", "group", id],
    queryFn: async () => {
      const res = await service({ id: id as Group["id"] });
      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        throw new Error(Object.values(res.data.errors).join(", "));
      }
      return res.data;
    },
    enabled: id != null,
  });
}

export function useCreateGroup() {
  const service = useCreateGroupService();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => {
      const res = await service(data);
      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        throw new Error(Object.values(res.data.errors).join(", "));
      }
      if (!res.data) throw new Error("Failed to save group");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["equipment", "groups"] });
    },
  });
}

export function useUpdateGroup() {
  const service = useUpdateGroupService();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: Group["id"];
      data: Parameters<typeof service>[0]["data"];
    }) => {
      const res = await service({ id, data });
      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        throw new Error(Object.values(res.data.errors).join(", "));
      }
      if (!res.data) throw new Error("Failed to save group");
      return res.data;
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["equipment", "groups"] });
      qc.invalidateQueries({ queryKey: ["equipment", "group", vars.id] });
    },
  });
}

export function useDeleteGroup() {
  const service = useDeleteGroupService();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: Group["id"] }) => {
      const res = await service({ id });
      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        throw new Error(Object.values(res.data.errors).join(", "));
      }
      if (res.status !== HTTP_CODES_ENUM.NO_CONTENT) {
        throw new Error("Failed to delete group");
      }
      return undefined;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["equipment", "groups"] });
    },
  });
}

// ── Subgroup hooks ──────────────────────────────────────────────────────────

export function useRegencies(
  groupId: Group["id"] | null,
  page = 1,
  limit = 10
) {
  const service = useGetRegenciesService();
  return useQuery({
    queryKey: ["equipment", "regencies", groupId, page, limit],
    queryFn: async () => {
      const res = await service({
        page,
        limit,
        filters:
          groupId != null ? { groupId: String(groupId) } : undefined,
      });
      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        throw new Error(Object.values(res.data.errors).join(", "));
      }
      return res.data;
    },
    enabled: groupId != null,
  });
}

export function useSubgroup(id: Subgroup["id"] | null) {
  const service = useGetSubgroupService();
  return useQuery({
    queryKey: ["equipment", "subgroup", id],
    queryFn: async () => {
      const res = await service({ id: id as Subgroup["id"] });
      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        throw new Error(Object.values(res.data.errors).join(", "));
      }
      return res.data;
    },
    enabled: id != null,
  });
}

export function useCreateSubgroup() {
  const service = useCreateSubgroupService();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof service>[0]) => {
      const res = await service(data);
      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        throw new Error(Object.values(res.data.errors).join(", "));
      }
      if (!res.data) throw new Error("Failed to save subgroup");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["equipment", "regencies"] });
    },
  });
}

export function useUpdateSubgroup() {
  const service = useUpdateSubgroupService();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: Subgroup["id"];
      data: Parameters<typeof service>[0]["data"];
    }) => {
      const res = await service({ id, data });
      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        throw new Error(Object.values(res.data.errors).join(", "));
      }
      if (!res.data) throw new Error("Failed to save subgroup");
      return res.data;
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["equipment", "regencies"] });
      qc.invalidateQueries({ queryKey: ["equipment", "subgroup", vars.id] });
    },
  });
}

export function useDeleteSubgroup() {
  const service = useDeleteSubgroupService();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: Subgroup["id"] }) => {
      const res = await service({ id });
      if (res.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        throw new Error(Object.values(res.data.errors).join(", "));
      }
      if (res.status !== HTTP_CODES_ENUM.NO_CONTENT) {
        throw new Error("Failed to delete subgroup");
      }
      return undefined;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["equipment", "regencies"] });
    },
  });
}
