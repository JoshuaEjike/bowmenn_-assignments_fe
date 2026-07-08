import { env } from "@/app/config/env";
import { adminApi } from "@/axios/admin.api";
import { adminMockService } from "./admin.mock";
import type { AdminListFilters } from "../types";

/**
 * The only import surface feature code (hooks, pages) should use for admin
 * directories. Swapping `VITE_USE_MOCK_API` to false switches every consumer
 * to the real backend with no call-site changes — same pattern as
 * `features/auth/services/auth.service.ts`.
 */
export const adminService = {
  listDrivers: (filters: AdminListFilters) => (env.useMockApi ? adminMockService.listDrivers(filters) : adminApi.listDrivers(filters)),

  getDriver: (id: string) => (env.useMockApi ? adminMockService.getDriver(id) : adminApi.getDriver(id)),

  listCustomers: (filters: AdminListFilters) =>
    env.useMockApi ? adminMockService.listCustomers(filters) : adminApi.listCustomers(filters),

  getCustomer: (id: string) => (env.useMockApi ? adminMockService.getCustomer(id) : adminApi.getCustomer(id)),

  listAllDrivers: () => (env.useMockApi ? Promise.resolve(adminMockService.listAllDrivers()) : adminApi.listAllDrivers()),
};
