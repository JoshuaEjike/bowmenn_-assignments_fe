import type { ShipmentStatus } from "@/app/types/domain";

/**
 * Query key factory. Keeping keys here (rather than inlined in hooks)
 * means invalidation call sites and query call sites can never drift apart.
 */
export const queryKeys = {
  auth: {
    session: () => ["auth", "session"] as const,
  },
  shipments: {
    all: () => ["shipments"] as const,
    lists: () => [...queryKeys.shipments.all(), "list"] as const,
    list: (filters: {
      user?: string;
      page: number;
      pageSize: number;
      search?: string;
      status?: ShipmentStatus | "all";
    }) => [...queryKeys.shipments.lists(), filters] as const,
    details: () => [...queryKeys.shipments.all(), "detail"] as const,
    detail: (id: string) => [...queryKeys.shipments.details(), id] as const,
    stats: (role: string) => [...queryKeys.shipments.all(), "stats", role] as const,
  },
  drivers: {
    all: () => ["drivers"] as const,
    lists: () => [...queryKeys.drivers.all(), "list"] as const,
    list: (filters: { page: number; pageSize: number; search?: string }) =>
      [...queryKeys.drivers.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.drivers.all(), "detail", id] as const,
  },
  customers: {
    all: () => ["customers"] as const,
    lists: () => [...queryKeys.customers.all(), "list"] as const,
    list: (filters: { page: number; pageSize: number; search?: string }) =>
      [...queryKeys.customers.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.customers.all(), "detail", id] as const,
  },
  notifications: {
    all: () => ["notifications"] as const,
    list: () => [...queryKeys.notifications.all(), "list"] as const,
  },
} as const;
