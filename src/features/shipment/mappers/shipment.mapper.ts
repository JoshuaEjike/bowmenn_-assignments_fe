import type {
  CustomerSummary,
  DriverSummary,
  GeoAddress,
  ProofOfDelivery,
  Shipment,
  ShipmentStatus,
  ShipmentTimelineEvent,
  TruckType,
} from "@/app/types/domain";

/** Shape returned by the backend's `toShipmentView` mapper (see the API's shipment-view.mapper.ts). */
export interface RawShipment {
  id: string;
  _id?: string;
  reference: string;
  status: ShipmentStatus;
  cargoDescription: string;
  cargoWeightKg: number;
  truckType: TruckType;
  pickup: GeoAddress;
  delivery: GeoAddress;
  customer: { id: string; fullName?: string; email?: string; phone?: string; companyName?: string };
  driver?: {
    id: string;
    fullName?: string;
    phone?: string;
    vehiclePlate?: string;
    truckType?: string;
    rating?: number;
  };
  timeline: Array<{ status: ShipmentStatus; note?: string; actorName?: string; timestamp: string }>;
  proofOfDelivery?: { imageUrl: string; receivedBy: string; signedAt: string; notes?: string };
  requestedPickupDate: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  priceEstimate: number;
  distanceKm: number;
  createdAt: string;
  updatedAt: string;
}

export interface RawShipmentRes {
  data: RawShipment;
  message: string;
  success: boolean;
}

function toCustomerSummary(customer: RawShipment["customer"]): CustomerSummary {
  return {
    id: customer.id,
    fullName: customer.fullName ?? "Unknown customer",
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    companyName: customer.companyName,
  };
}

function toDriverSummary(driver: RawShipment["driver"]): DriverSummary | undefined {
  if (!driver) return undefined;
  return {
    id: driver.id,
    fullName: driver.fullName ?? "Unknown driver",
    phone: driver.phone ?? "",
    vehiclePlate: driver?.vehiclePlate,
    rating: driver.rating,
    truckType: driver.truckType as TruckType | undefined,
  };
}

function toTimeline(timeline: RawShipment["timeline"], shipmentId: string): ShipmentTimelineEvent[] {
  return timeline.map((entry, index) => ({
    id: `${shipmentId}-evt-${index}`,
    status: entry.status,
    note: entry.note,
    actorName: entry.actorName,
    timestamp: entry.timestamp,
  }));
}

function toProofOfDelivery(
  pod: RawShipment["proofOfDelivery"],
  shipmentId: string,
): ProofOfDelivery | undefined {
  if (!pod) return undefined;
  return {
    id: `${shipmentId}-pod`,
    imageUrl: pod.imageUrl,
    receivedBy: pod.receivedBy,
    signedAt: pod.signedAt,
    notes: pod.notes,
  };
}

export function toFrontendShipment(raw: RawShipment): Shipment {
  return {
    id: raw?._id ?? raw?.id ?? "",
    reference: raw.reference,
    status: raw.status,
    cargoDescription: raw.cargoDescription,
    cargoWeightKg: raw.cargoWeightKg,
    truckType: raw.truckType,
    pickup: raw.pickup,
    delivery: raw.delivery,
    customer: toCustomerSummary(raw.customer),
    driver: toDriverSummary(raw.driver),
    timeline: toTimeline(raw.timeline, raw.id),
    proofOfDelivery: toProofOfDelivery(raw.proofOfDelivery, raw.id),
    requestedPickupDate: raw.requestedPickupDate,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    priceEstimate: raw.priceEstimate,
    distanceKm: raw.distanceKm,
  };
}
