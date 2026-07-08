import { httpClient } from "./axios";
import {
  RawDirectoryEntryRes,
  toAdminCustomerProfile,
  toAdminDriverProfile,
  type RawDirectoryEntry,
} from "@/features/admin/mappers/admin.mapper";
import type { AdminCustomerProfile, AdminDriverProfile, AdminListFilters } from "@/features/admin/types";
import type { PaginatedResult } from "@/app/types/domain";

type ArrayWithMeta<T> = { data: T[] } & {
  meta: { page: number; limit: number; total: number; totalPages: number };
};

function toParams(filters: AdminListFilters): Record<string, string | number> {
  const params: Record<string, string | number> = { page: filters.page, limit: filters.pageSize };
  if (filters.search) params.search = filters.search;
  return params;
}

export const adminApi = {
  listDrivers: async (filters: AdminListFilters): Promise<PaginatedResult<AdminDriverProfile>> => {
    const response = await httpClient.get<ArrayWithMeta<RawDirectoryEntry>>("/admin/drivers", {
      params: toParams(filters),
    });
    const raw = response.data;
    return {
      items: raw?.data?.map(toAdminDriverProfile),
      page: raw.meta.page,
      pageSize: raw.meta.limit,
      totalItems: raw.meta.total,
      totalPages: raw.meta.totalPages,
    };
  },

  getDriver: (id: string) =>
    httpClient
      .get<RawDirectoryEntryRes>(`/admin/drivers/${id}`)
      .then((r) => toAdminDriverProfile(r.data?.data)),

  listCustomers: async (filters: AdminListFilters): Promise<PaginatedResult<AdminCustomerProfile>> => {
    const response = await httpClient.get<ArrayWithMeta<RawDirectoryEntry>>("/admin/customers", {
      params: toParams(filters),
    });
    const raw = response.data;
    return {
      items: raw?.data?.map(toAdminCustomerProfile),
      page: raw.meta.page,
      pageSize: raw.meta.limit,
      totalItems: raw.meta.total,
      totalPages: raw.meta.totalPages,
    };
  },

  getCustomer: (id: string) =>
    httpClient
      .get<RawDirectoryEntryRes>(`/admin/customers/${id}`)
      .then((r) => toAdminCustomerProfile(r?.data?.data)),

  // Used to populate the "assign a driver" dropdown — there's no dedicated
  // unpaginated endpoint on the backend, so this asks for a page large enough
  // to cover the whole fleet in one request.
  listAllDrivers: async (): Promise<AdminDriverProfile[]> => {
    const { items } = await adminApi.listDrivers({ page: 1, pageSize: 100 });
    return items;
  },
};
