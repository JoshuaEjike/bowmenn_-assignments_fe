import { mockDelay, nextId, paginate, matchesSearch } from "@/app/lib/mock-api";
import type {
  DriverSummary,
  GeoAddress,
  Shipment,
  ShipmentStatus,
  ShipmentTimelineEvent,
} from "@/app/types/domain";
import { SHIPMENT_LIFECYCLE } from "@/app/constants/shipment-status";
import type {
  AssignDriverPayload,
  CreateShipmentPayload,
  ShipmentListFilters,
  ShipmentStats,
  UpdateShipmentStatusPayload,
} from "../types";

const mockDrivers: DriverSummary[] = [
  {
    id: "drv_1",
    fullName: "Tunde Bello",
    phone: "+2348023456789",
    vehiclePlate: "LSD 442 KJ",
    truckType: "box_truck",
    rating: 4.8,
  },
  {
    id: "drv_2",
    fullName: "Grace Adeyemi",
    phone: "+2348045671234",
    vehiclePlate: "ABJ 118 XZ",
    truckType: "flatbed",
    rating: 4.6,
  },
  {
    id: "drv_3",
    fullName: "Musa Ibrahim",
    phone: "+2348056782345",
    vehiclePlate: "KAN 903 QR",
    truckType: "refrigerated",
    rating: 4.9,
  },
];

function address(label: string, city: string, state: string): GeoAddress {
  return {
    label,
    line1: `${Math.floor(Math.random() * 200) + 1} ${label} Road`,
    city,
    state,
    postalCode: "100001",
    country: "Nigeria",
    contactName: "Warehouse Desk",
    contactPhone: "+2348011122233",
  };
}

function buildTimeline(status: ShipmentStatus, createdAt: Date): ShipmentTimelineEvent[] {
  const reachedIndex = SHIPMENT_LIFECYCLE.indexOf(status);
  const upto = reachedIndex === -1 ? 0 : reachedIndex;
  return SHIPMENT_LIFECYCLE.slice(0, upto + 1).map((s, i) => ({
    id: `evt_${i}`,
    status: s,
    timestamp: new Date(createdAt.getTime() + i * 6 * 60 * 60 * 1000).toISOString(),
    actorName: i === 0 ? "System" : mockDrivers[i % mockDrivers.length]?.fullName,
  }));
}

function buildShipment(index: number, customerId: string, customerName: string): Shipment {
  const statuses: ShipmentStatus[] = [
    "pending",
    "assigned",
    "accepted",
    "picked_up",
    "in_transit",
    "delivered",
    "cancelled",
  ];
  const status = statuses[index % statuses.length] as ShipmentStatus;
  const createdAt = new Date(Date.now() - (index + 1) * 36 * 60 * 60 * 1000);
  const driver = status === "pending" ? undefined : mockDrivers[index % mockDrivers.length];

  return {
    id: nextId("shp"),
    reference: `BWM-${(10000 + index).toString()}`,
    status,
    cargoDescription: [
      "Packaged electronics",
      "Bagged rice",
      "Auto parts",
      "Construction steel",
      "Pharma supplies",
    ][index % 5] as string,
    cargoWeightKg: 500 + index * 137,
    truckType: (["box_truck", "flatbed", "refrigerated", "container", "heavy_haul"] as const)[
      index % 5
    ] as Shipment["truckType"],
    pickup: address("Apapa Port", "Lagos", "Lagos"),
    delivery: address("Sabon Gari", "Kano", "Kano"),
    customer: {
      id: customerId,
      fullName: customerName,
      email: "customer@bowmenn.com",
      phone: "+2348034567890",
      companyName: "Chukwu Trading Co.",
    },
    driver,
    timeline: buildTimeline(status, createdAt),
    proofOfDelivery:
      status === "delivered"
        ? {
            id: nextId("pod"),
            imageUrl: "",
            receivedBy: "Warehouse Manager",
            signedAt: new Date().toISOString(),
          }
        : undefined,
    requestedPickupDate: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: createdAt.toISOString(),
    updatedAt: new Date().toISOString(),
    priceEstimate: 85000 + index * 4200,
    distanceKm: 980 + index * 12,
  };
}

const mockShipments: Shipment[] = Array.from({ length: 47 }, (_, i) =>
  buildShipment(i, "user_customer_1", "Ifeoma Chukwu"),
);

export const shipmentMockService = {
  async list(filters: ShipmentListFilters) {
    await mockDelay();
    const filtered = mockShipments.filter((s) => {
      const statusOk = !filters.status || filters.status === "all" || s.status === filters.status;
      const searchOk = matchesSearch([s.reference, s.cargoDescription, s.customer.fullName], filters.search);
      return statusOk && searchOk;
    });
    return paginate(filtered, filters);
  },

  async detail(id: string): Promise<Shipment> {
    await mockDelay(350);
    const shipment = mockShipments.find((s) => s.id === id);
    if (!shipment) throw { message: "Shipment not found.", code: "NOT_FOUND", status: 404 };
    return shipment;
  },

  async stats(): Promise<ShipmentStats> {
    await mockDelay(300);
    return {
      total: mockShipments.length,
      pendingBooking: mockShipments.filter((s) => s.status === "pending").length,
      active: mockShipments.filter((s) => !["delivered", "cancelled", "pending"].includes(s.status)).length,
      delivered: mockShipments.filter((s) => s.status === "delivered").length,
      cancelled: mockShipments.filter((s) => s.status === "cancelled").length,
    };
  },

  async create(payload: CreateShipmentPayload): Promise<Shipment> {
    await mockDelay(700);
    const shipment: Shipment = {
      id: nextId("shp"),
      reference: `BWM-${Math.floor(10000 + Math.random() * 9000)}`,
      status: "pending",
      cargoDescription: payload.cargoDescription ?? "",
      cargoWeightKg: payload.cargoWeightKg ?? 0,
      truckType: payload.truckType ?? "box_truck",
      pickup: payload.pickup ?? {},
      delivery: payload.delivery ?? {},
      customer: {
        id: "user_customer_1",
        fullName: "Ifeoma Chukwu",
        email: "customer@bowmenn.com",
        phone: "+2348034567890",
      },
      timeline: [
        { id: "evt_0", status: "pending", timestamp: new Date().toISOString(), actorName: "System" },
      ],
      requestedPickupDate: payload.requestedPickupDate ?? "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priceEstimate: Math.round(payload.cargoWeightKg ?? 0 * 45 + 20000),
      distanceKm: 620,
    };
    mockShipments.unshift(shipment);
    return shipment;
  },

  async updateStatus({ shipmentId, status, note }: UpdateShipmentStatusPayload): Promise<Shipment> {
    await mockDelay(500);
    const shipment = mockShipments.find((s) => s.id === shipmentId);
    if (!shipment) throw { message: "Shipment not found.", code: "NOT_FOUND", status: 404 };
    shipment.status = status;
    shipment.updatedAt = new Date().toISOString();
    shipment.timeline.push({
      id: nextId("evt"),
      status,
      note,
      timestamp: new Date().toISOString(),
      actorName: shipment.driver?.fullName ?? "System",
    });
    return shipment;
  },

  async assignDriver({ shipmentId, driverId }: AssignDriverPayload): Promise<Shipment> {
    await mockDelay(500);
    const shipment = mockShipments.find((s) => s.id === shipmentId);
    const driver = mockDrivers.find((d) => d.id === driverId);
    if (!shipment || !driver)
      throw { message: "Shipment or driver not found.", code: "NOT_FOUND", status: 404 };
    shipment.driver = driver;
    shipment.status = "assigned";
    shipment.timeline.push({
      id: nextId("evt"),
      status: "assigned",
      timestamp: new Date().toISOString(),
      actorName: "Dispatch",
    });
    return shipment;
  },

  async uploadPod({
    shipmentId,
    file,
    receivedBy,
    notes,
  }: {
    shipmentId: string;
    file: File | null;
    receivedBy: string;
    notes?: string;
  }): Promise<Shipment> {
    await mockDelay(900);
    const shipment = mockShipments.find((s) => s.id === shipmentId);
    if (!shipment) throw { message: "Shipment not found.", code: "NOT_FOUND", status: 404 };
    shipment.proofOfDelivery = {
      id: nextId("pod"),
      // No real storage backend in mock mode — a local object URL is enough
      // to preview the exact file the user picked.
      imageUrl: file?.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      receivedBy,
      signedAt: new Date().toISOString(),
      notes,
    };
    shipment.status = "delivered";
    shipment.updatedAt = new Date().toISOString();
    shipment.timeline.push({
      id: nextId("evt"),
      status: "delivered",
      timestamp: new Date().toISOString(),
      actorName: shipment.driver?.fullName ?? "Driver",
    });
    return shipment;
  },

  listDrivers: () => mockDrivers,
};
