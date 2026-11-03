import { useCallback } from "react";
import useFetch from "@/services/api/use-fetch";
import { API_URL } from "@/services/api/config";
import wrapperFetchJsonResponse from "@/services/api/wrapper-fetch-json-response";
import type { InfinityPaginationType } from "@/services/api/types/infinity-pagination";
import type { SortEnum } from "@/services/api/types/sort-type";
import type { RequestConfigType } from "@/services/api/services/types/request-config";
import type { Group, Subgroup } from "../types/equipment";

// ── Group ────────────────────────────────────────────────────────────────

export type GroupListRequest = {
  page: number;
  limit: number;
  filters?: Record<string, string | number | boolean>;
  sort?: Array<{ orderBy: keyof Group; order: SortEnum }>;
};

export type GroupListResponse = InfinityPaginationType<Group>;

export function useGetGroupsService() {
  const fetch = useFetch();
  return useCallback(
    (data: GroupListRequest, requestConfig?: RequestConfigType) => {
      const url = new URL(`${API_URL}/v1/equipment/groups`);
      url.searchParams.append("page", String(data.page));
      url.searchParams.append("limit", String(data.limit));
      if (data.filters) {
        url.searchParams.append("filters", JSON.stringify(data.filters));
      }
      if (data.sort) {
        url.searchParams.append("sort", JSON.stringify(data.sort));
      }
      return fetch(url, { method: "GET", ...requestConfig }).then(
        wrapperFetchJsonResponse<GroupListResponse>
      );
    },
    [fetch]
  );
}

export type GroupGetRequest = { id: Group["id"] };
export type GroupGetResponse = Group;

export function useGetGroupService() {
  const fetch = useFetch();
  return useCallback(
    (data: GroupGetRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/equipment/groups/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<GroupGetResponse>);
    },
    [fetch]
  );
}

export type GroupPostRequest = Pick<Group, "name" | "isoCode" | "latitude" | "longitude">;
export type GroupPostResponse = Group;

export function useCreateGroupService() {
  const fetch = useFetch();
  return useCallback(
    (data: GroupPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/equipment/groups`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<GroupPostResponse>);
    },
    [fetch]
  );
}

export type GroupPatchRequest = {
  id: Group["id"];
  data: Partial<Omit<GroupPostRequest, never>>;
};
export type GroupPatchResponse = Group;

export function useUpdateGroupService() {
  const fetch = useFetch();
  return useCallback(
    (data: GroupPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/equipment/groups/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<GroupPatchResponse>);
    },
    [fetch]
  );
}

export type GroupDeleteRequest = { id: Group["id"] };
export type GroupDeleteResponse = undefined;

export function useDeleteGroupService() {
  const fetch = useFetch();
  return useCallback(
    (data: GroupDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/equipment/groups/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<GroupDeleteResponse>);
    },
    [fetch]
  );
}

// ── Subgroup ─────────────────────────────────────────────────────────────────

export type SubgroupListRequest = {
  page: number;
  limit: number;
  filters?: Record<string, string | number | boolean>;
  sort?: Array<{ orderBy: keyof Subgroup; order: SortEnum }>;
};

export type SubgroupListResponse = InfinityPaginationType<Subgroup>;

export function useGetRegenciesService() {
  const fetch = useFetch();
  return useCallback(
    (data: SubgroupListRequest, requestConfig?: RequestConfigType) => {
      const url = new URL(`${API_URL}/v1/equipment/regencies`);
      url.searchParams.append("page", String(data.page));
      url.searchParams.append("limit", String(data.limit));
      if (data.filters) {
        url.searchParams.append("filters", JSON.stringify(data.filters));
      }
      if (data.sort) {
        url.searchParams.append("sort", JSON.stringify(data.sort));
      }
      return fetch(url, { method: "GET", ...requestConfig }).then(
        wrapperFetchJsonResponse<SubgroupListResponse>
      );
    },
    [fetch]
  );
}

export type SubgroupGetRequest = { id: Subgroup["id"] };
export type SubgroupGetResponse = Subgroup;

export function useGetSubgroupService() {
  const fetch = useFetch();
  return useCallback(
    (data: SubgroupGetRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/equipment/regencies/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<SubgroupGetResponse>);
    },
    [fetch]
  );
}

export type SubgroupPostRequest = Pick<Subgroup, "groupId" | "name" | "type" | "isActive">;
export type SubgroupPostResponse = Subgroup;

export function useCreateSubgroupService() {
  const fetch = useFetch();
  return useCallback(
    (data: SubgroupPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/equipment/regencies`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<SubgroupPostResponse>);
    },
    [fetch]
  );
}

export type SubgroupPatchRequest = {
  id: Subgroup["id"];
  data: Partial<Omit<SubgroupPostRequest, never>>;
};
export type SubgroupPatchResponse = Subgroup;

export function useUpdateSubgroupService() {
  const fetch = useFetch();
  return useCallback(
    (data: SubgroupPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/equipment/regencies/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<SubgroupPatchResponse>);
    },
    [fetch]
  );
}

export type SubgroupDeleteRequest = { id: Subgroup["id"] };
export type SubgroupDeleteResponse = undefined;

export function useDeleteSubgroupService() {
  const fetch = useFetch();
  return useCallback(
    (data: SubgroupDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/equipment/regencies/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<SubgroupDeleteResponse>);
    },
    [fetch]
  );
}

/**
 * Convenience helper — non-hook, returns raw fetch promise.
 * Gunakan di dalam useEffect/detail-tab untuk fetch regencies by groupId.
 */
export function fetchRegenciesByGroup(
  groupId: Group["id"],
  limit = 100,
  fetch: ReturnType<typeof import("@/services/api/use-fetch").default> | null = null
): Promise<Response> {
  const url = new URL(`${API_URL}/v1/equipment/regencies`);
  url.searchParams.append("page", "1");
  url.searchParams.append("limit", String(limit));
  url.searchParams.append("filters", JSON.stringify({ groupId: String(groupId) }));
  return (fetch ?? globalThis.fetch)(url, { method: "GET" });
}