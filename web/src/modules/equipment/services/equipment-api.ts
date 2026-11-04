import { useCallback } from "react";
import useFetch from "@/services/api/use-fetch";
import { API_URL } from "@/services/api/config";
import wrapperFetchJsonResponse from "@/services/api/wrapper-fetch-json-response";
import type { InfinityPaginationType } from "@/services/api/types/infinity-pagination";
import type { SortEnum } from "@/services/api/types/sort-type";
import type { RequestConfigType } from "@/services/api/services/types/request-config";
import type { Group, Subgroup, Category, EquipmentItem } from "../types/equipment";

type ListRequest<T> = {
  page: number;
  limit: number;
  filters?: Record<string, string | number | boolean>;
  sort?: Array<{ orderBy: keyof T; order: SortEnum }>;
};

export type GroupListRequest = ListRequest<Group>;
export type GroupListResponse = InfinityPaginationType<Group>;

export function useGetGroupsService() {
  const fetch = useFetch();
  return useCallback((data: GroupListRequest, config?: RequestConfigType) => {
    const url = new URL(`${API_URL}/v1/equipment/groups`);
    url.searchParams.set("page", String(data.page));
    url.searchParams.set("limit", String(data.limit));
    if (data.filters) url.searchParams.set("filters", JSON.stringify(data.filters));
    if (data.sort) url.searchParams.set("sort", JSON.stringify(data.sort));
    return fetch(url, { method: "GET", ...config }).then(wrapperFetchJsonResponse<GroupListResponse>);
  }, [fetch]);
}

export function useGetGroupService() {
  const fetch = useFetch();
  return useCallback((data: { id: Group["id"] }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/groups/${data.id}`, { method: "GET", ...config }).then(wrapperFetchJsonResponse<Group>), [fetch]);
}

export type GroupWriteRequest = Pick<Group, "name" | "description" | "isActive">;
export function useCreateGroupService() {
  const fetch = useFetch();
  return useCallback((data: GroupWriteRequest, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/groups`, { method: "POST", body: JSON.stringify(data), ...config }).then(wrapperFetchJsonResponse<Group>), [fetch]);
}
export function useUpdateGroupService() {
  const fetch = useFetch();
  return useCallback((data: { id: Group["id"]; data: Partial<GroupWriteRequest> }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/groups/${data.id}`, { method: "PATCH", body: JSON.stringify(data.data), ...config }).then(wrapperFetchJsonResponse<Group>), [fetch]);
}
export function useDeleteGroupService() {
  const fetch = useFetch();
  return useCallback((data: { id: Group["id"] }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/groups/${data.id}`, { method: "DELETE", ...config }).then(wrapperFetchJsonResponse<undefined>), [fetch]);
}

export type SubgroupListRequest = ListRequest<Subgroup>;
export type SubgroupListResponse = InfinityPaginationType<Subgroup>;
export function useGetSubgroupsService() {
  const fetch = useFetch();
  return useCallback((data: SubgroupListRequest, config?: RequestConfigType) => {
    const url = new URL(`${API_URL}/v1/equipment/subgroups`);
    url.searchParams.set("page", String(data.page));
    url.searchParams.set("limit", String(data.limit));
    if (data.filters) url.searchParams.set("filters", JSON.stringify(data.filters));
    if (data.sort) url.searchParams.set("sort", JSON.stringify(data.sort));
    return fetch(url, { method: "GET", ...config }).then(wrapperFetchJsonResponse<SubgroupListResponse>);
  }, [fetch]);
}
export function useGetSubgroupService() {
  const fetch = useFetch();
  return useCallback((data: { id: Subgroup["id"] }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/subgroups/${data.id}`, { method: "GET", ...config }).then(wrapperFetchJsonResponse<Subgroup>), [fetch]);
}

export type SubgroupWriteRequest = Pick<Subgroup, "groupId" | "name" | "description" | "isActive">;
export function useCreateSubgroupService() {
  const fetch = useFetch();
  return useCallback((data: SubgroupWriteRequest, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/subgroups`, { method: "POST", body: JSON.stringify(data), ...config }).then(wrapperFetchJsonResponse<Subgroup>), [fetch]);
}
export function useUpdateSubgroupService() {
  const fetch = useFetch();
  return useCallback((data: { id: Subgroup["id"]; data: Partial<SubgroupWriteRequest> }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/subgroups/${data.id}`, { method: "PATCH", body: JSON.stringify(data.data), ...config }).then(wrapperFetchJsonResponse<Subgroup>), [fetch]);
}
export function useDeleteSubgroupService() {
  const fetch = useFetch();
  return useCallback((data: { id: Subgroup["id"] }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/subgroups/${data.id}`, { method: "DELETE", ...config }).then(wrapperFetchJsonResponse<undefined>), [fetch]);
}

export type CategoryListRequest = ListRequest<Category>;
export type CategoryListResponse = InfinityPaginationType<Category>;
export function useGetCategoriesService() {
  const fetch = useFetch();
  return useCallback((data: CategoryListRequest, config?: RequestConfigType) => {
    const url = new URL(`${API_URL}/v1/equipment/categories`);
    url.searchParams.set("page", String(data.page));
    url.searchParams.set("limit", String(data.limit));
    if (data.filters) url.searchParams.set("filters", JSON.stringify(data.filters));
    if (data.sort) url.searchParams.set("sort", JSON.stringify(data.sort));
    return fetch(url, { method: "GET", ...config }).then(wrapperFetchJsonResponse<CategoryListResponse>);
  }, [fetch]);
}
export function useGetCategoryService() {
  const fetch = useFetch();
  return useCallback((data: { id: Category["id"] }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/categories/${data.id}`, { method: "GET", ...config }).then(wrapperFetchJsonResponse<Category>), [fetch]);
}
export type CategoryWriteRequest = Pick<Category, "subgroupId" | "name" | "description" | "isActive">;
export function useCreateCategoryService() {
  const fetch = useFetch();
  return useCallback((data: CategoryWriteRequest, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/categories`, { method: "POST", body: JSON.stringify(data), ...config }).then(wrapperFetchJsonResponse<Category>), [fetch]);
}
export function useUpdateCategoryService() {
  const fetch = useFetch();
  return useCallback((data: { id: Category["id"]; data: Partial<CategoryWriteRequest> }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/categories/${data.id}`, { method: "PATCH", body: JSON.stringify(data.data), ...config }).then(wrapperFetchJsonResponse<Category>), [fetch]);
}
export function useDeleteCategoryService() {
  const fetch = useFetch();
  return useCallback((data: { id: Category["id"] }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/categories/${data.id}`, { method: "DELETE", ...config }).then(wrapperFetchJsonResponse<undefined>), [fetch]);
}

export type EquipmentItemListRequest = ListRequest<EquipmentItem>;
export type EquipmentItemListResponse = InfinityPaginationType<EquipmentItem>;
export function useGetEquipmentItemsService() {
  const fetch = useFetch();
  return useCallback((data: EquipmentItemListRequest, config?: RequestConfigType) => {
    const url = new URL(`${API_URL}/v1/equipment/items`);
    url.searchParams.set("page", String(data.page));
    url.searchParams.set("limit", String(data.limit));
    if (data.filters) url.searchParams.set("filters", JSON.stringify(data.filters));
    if (data.sort) url.searchParams.set("sort", JSON.stringify(data.sort));
    return fetch(url, { method: "GET", ...config }).then(wrapperFetchJsonResponse<EquipmentItemListResponse>);
  }, [fetch]);
}
export function useGetEquipmentItemService() {
  const fetch = useFetch();
  return useCallback((data: { id: EquipmentItem["id"] }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/items/${data.id}`, { method: "GET", ...config }).then(wrapperFetchJsonResponse<EquipmentItem>), [fetch]);
}
export type EquipmentItemWriteRequest = Pick<EquipmentItem, "subgroupId" | "categoryId" | "name" | "description" | "isActive">;
export function useCreateEquipmentItemService() {
  const fetch = useFetch();
  return useCallback((data: EquipmentItemWriteRequest, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/items`, { method: "POST", body: JSON.stringify(data), ...config }).then(wrapperFetchJsonResponse<EquipmentItem>), [fetch]);
}
export function useUpdateEquipmentItemService() {
  const fetch = useFetch();
  return useCallback((data: { id: EquipmentItem["id"]; data: Partial<EquipmentItemWriteRequest> }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/items/${data.id}`, { method: "PATCH", body: JSON.stringify(data.data), ...config }).then(wrapperFetchJsonResponse<EquipmentItem>), [fetch]);
}
export function useDeleteEquipmentItemService() {
  const fetch = useFetch();
  return useCallback((data: { id: EquipmentItem["id"] }, config?: RequestConfigType) =>
    fetch(`${API_URL}/v1/equipment/items/${data.id}`, { method: "DELETE", ...config }).then(wrapperFetchJsonResponse<undefined>), [fetch]);
}
