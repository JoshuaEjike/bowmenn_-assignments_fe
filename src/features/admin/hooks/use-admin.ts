import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/admin.service";
import type { AdminListFilters } from "../types";

const adminKeys = {
  drivers: (filters: AdminListFilters) => ["admin", "drivers", filters] as const,
  driver: (id: string) => ["admin", "drivers", "detail", id] as const,
  customers: (filters: AdminListFilters) => ["admin", "customers", filters] as const,
  customer: (id: string) => ["admin", "customers", "detail", id] as const,
};

export function useAdminDrivers(filters: AdminListFilters) {
  return useQuery({
    queryKey: adminKeys.drivers(filters),
    queryFn: () => adminService.listDrivers(filters),
    placeholderData: (prev) => prev,
  });
}

export function useAdminDriver(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.driver(id ?? ""),
    queryFn: () => adminService.getDriver(id as string),
    enabled: Boolean(id),
  });
}

export function useAdminCustomers(filters: AdminListFilters) {
  return useQuery({
    queryKey: adminKeys.customers(filters),
    queryFn: () => adminService.listCustomers(filters),
    placeholderData: (prev) => prev,
  });
}

export function useAdminCustomer(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.customer(id ?? ""),
    queryFn: () => adminService.getCustomer(id as string),
    enabled: Boolean(id),
  });
}

export function useAllDrivers() {
  return useQuery({ queryKey: ["admin", "drivers", "all"], queryFn: () => adminService.listAllDrivers() });
}
