import type { Shipment, ShipmentStatus, TruckType, GeoAddress } from "@/app/types/domain";

export interface ShipmentListFilters {
  user?: string;
  page: number;
  pageSize: number;
  search?: string;
  status?: ShipmentStatus | "all";
}

export interface CreateShipmentPayload {
  cargoDescription: string;
  cargoWeightKg: number;
  truckType: TruckType;
  pickup: GeoAddress;
  delivery: GeoAddress;
  requestedPickupDate: string;
}

export interface UpdateShipmentStatusPayload {
  shipmentId: string;
  status: ShipmentStatus;
  note?: string;
}

export interface AssignDriverPayload {
  shipmentId: string;
  driverId: string;
}

export interface UploadPodPayload {
  shipmentId: string;
  file: File | null;
  receivedBy: string;
  notes?: string;
}

export interface ShipmentStats {
  total: number;
  pendingBooking: number;
  active: number;
  delivered: number;
  cancelled: number;
}

export type { Shipment };
