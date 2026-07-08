import type { AdminCustomerProfile, AdminDriverProfile } from "../types";

/** Shape returned by the backend's AdminRepository.DirectoryEntry (see the API's admin.repository.ts). */
export interface RawDirectoryEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  vehiclePlate?: string;
  truckType?: string;
  isActive: boolean;
  createdAt: string;
  totalShipments: number;
}

export interface RawDirectoryEntryRes {
  data: RawDirectoryEntry;
  message: string;
  success: boolean;
}

export function toAdminDriverProfile(raw: RawDirectoryEntry): AdminDriverProfile {
  return {
    id: raw.id,
    fullName: `${raw.firstName} ${raw.lastName}`,
    email: raw.email,
    phone: raw.phone,
    vehiclePlate: raw.vehiclePlate,
    truckType: raw.truckType,
    // The backend doesn't track a driver rating yet, so this is left
    // undefined rather than invented — the UI already renders "—" for it.
    rating: undefined,
    totalDeliveries: raw.totalShipments,
    isActive: raw.isActive,
    joinedAt: raw.createdAt,
  };
}

export function toAdminCustomerProfile(raw: RawDirectoryEntry): AdminCustomerProfile {
  return {
    id: raw.id,
    fullName: `${raw.firstName} ${raw.lastName}`,
    companyName: raw.companyName,
    email: raw.email,
    phone: raw.phone,
    totalShipments: raw.totalShipments,
    joinedAt: raw.createdAt,
  };
}
