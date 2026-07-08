import { httpClient } from "./axios";
import {
  RawShipmentRes,
  toFrontendShipment,
  type RawShipment,
} from "@/features/shipment/mappers/shipment.mapper";
import type {
  AssignDriverPayload,
  CreateShipmentPayload,
  ShipmentListFilters,
  ShipmentStats,
  UpdateShipmentStatusPayload,
  UploadPodPayload,
} from "@/features/shipment/types";
import type { PaginatedResult, Shipment } from "@/app/types/domain";

interface BackendShipmentStats {
  total: number;
  pending: number;
  active: number;
  delivered: number;
  cancelled: number;
}

interface BackendShipmentStatsData {
  data: BackendShipmentStats;
  message: string;
  success: boolean;
}

type ArrayWithMeta<T> = { data: T[] } & {
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export const shipmentApi = {
  create: (payload: CreateShipmentPayload) =>
    httpClient.post<RawShipmentRes>("/shipments", payload).then((r) => toFrontendShipment(r?.data?.data)),

  list: async (filters: ShipmentListFilters): Promise<PaginatedResult<Shipment>> => {
    const params: Record<string, string | number> = { page: filters.page, limit: filters.pageSize };
    if (filters.search) params.search = filters.search;
    if (filters.status && filters.status !== "all") params.status = filters.status;

    const response = await httpClient.get<ArrayWithMeta<RawShipment>>("/shipments", { params });

    const raw = response.data;

    return {
      items: raw?.data?.map(toFrontendShipment),
      page: raw.meta.page,
      pageSize: raw.meta.limit,
      totalItems: raw.meta.total,
      totalPages: raw.meta.totalPages,
    };
  },

  detail: (id: string) =>
    httpClient.get<RawShipmentRes>(`/shipments/${id}`).then((r) => toFrontendShipment(r.data?.data)),

  stats: async (): Promise<ShipmentStats> => {
    const { data } = await httpClient.get<BackendShipmentStatsData>("/shipments/stats");

    return {
      total: data?.data?.total,
      pendingBooking: data?.data?.pending,
      active: data?.data?.active,
      delivered: data?.data?.delivered,
      cancelled: data?.data?.cancelled,
    };
  },

  updateStatus: ({ shipmentId, status, note }: UpdateShipmentStatusPayload) =>
    httpClient
      .patch<RawShipmentRes>(`/shipments/${shipmentId}/status`, { status, note })
      .then((r) => toFrontendShipment(r?.data?.data)),

  assignDriver: ({ shipmentId, driverId }: AssignDriverPayload) =>
    httpClient
      .patch<RawShipmentRes>(`/shipments/${shipmentId}/assign`, { driverId })
      .then((r) => toFrontendShipment(r.data?.data)),

  uploadPod: ({ shipmentId, file, receivedBy, notes }: UploadPodPayload) => {
    const formData = new FormData();

    formData.append("file", file ?? "");
    formData.append("receivedBy", receivedBy);
    if (notes) formData.append("notes", notes);

    return httpClient
      .post<RawShipmentRes>(`/shipments/${shipmentId}/pod`, formData, {
        // The instance default is "application/json" (see axios/axios.ts).
        // Explicitly clearing it here, rather than relying on axios to
        // detect the FormData body, ensures the browser sets its own
        // multipart Content-Type header with the required boundary.
        headers: { "Content-Type": null },
      })
      .then((r) => toFrontendShipment(r.data?.data));
  },
};
