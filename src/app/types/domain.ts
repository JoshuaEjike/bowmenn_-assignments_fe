/**
 * Core domain types shared across every feature module.
 * Feature-specific request/response DTOs live inside each
 * feature's own `types/` folder and extend these where relevant.
 */

export const TRUCK_TYPES = [
  "flatbed",
  "box_truck",
  "refrigerated",
  "tanker",
  "container",
  "heavy_haul",
] as const;

export type TruckType = (typeof TRUCK_TYPES)[number];

export type UserRole = "admin" | "driver" | "customer";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  truckType?: TruckType;
  vehiclePlate?: string;
  companyName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthUserRes {
  data: AuthUser;
  message: string;
  success: boolean;
}

export const SHIPMENT_STATUSES = [
  "pending_booking",
  "pending",
  "assigned",
  "accepted",
  "picked_up",
  "in_transit",
  "delivered",
  "cancelled",
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export interface GeoAddress {
  label?: string;
  line1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  lat?: number;
  lng?: number;
  contactName?: string;
  contactPhone?: string;
}

export interface ShipmentTimelineEvent {
  id: string;
  status: ShipmentStatus;
  note?: string;
  actorName?: string;
  timestamp: string;
}

export interface ProofOfDelivery {
  id: string;
  imageUrl: string;
  receivedBy: string;
  signedAt: string;
  notes?: string;
}

export interface DriverSummary {
  id: string;
  fullName: string;
  phone: string;
  vehiclePlate?: string;
  truckType?: TruckType;
  rating?: number;
  avatarUrl?: string;
}

export interface CustomerSummary {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
}

export interface Shipment {
  id: string;
  reference: string;
  status: ShipmentStatus;
  cargoDescription: string;
  cargoWeightKg: number;
  truckType: TruckType;
  pickup: GeoAddress;
  delivery: GeoAddress;
  customer: CustomerSummary;
  driver?: DriverSummary;
  timeline: ShipmentTimelineEvent[];
  proofOfDelivery?: ProofOfDelivery;
  requestedPickupDate: string;
  createdAt: string;
  updatedAt: string;
  priceEstimate: number;
  distanceKm: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  fieldErrors?: Record<string, string>;
}
