import type { PaginatedResult } from "@/app/types/domain";

export interface AdminListFilters {
  page: number;
  pageSize: number;
  search?: string;
}

export interface AdminDriverProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  vehiclePlate?: string;
  truckType?: string;
  rating?: number;
  totalDeliveries: number;
  isActive: boolean;
  joinedAt: string;
}

export interface AdminCustomerProfile {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  totalShipments: number;
  joinedAt: string;
}

export type AdminDriverList = PaginatedResult<AdminDriverProfile>;
export type AdminCustomerList = PaginatedResult<AdminCustomerProfile>;
