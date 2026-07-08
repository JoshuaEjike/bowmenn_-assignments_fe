import { env } from "@/app/config/env";
import { shipmentApi } from "@/axios/shipment.api";
import { shipmentMockService } from "./shipment.mock";
import type {
  AssignDriverPayload,
  CreateShipmentPayload,
  ShipmentListFilters,
  UpdateShipmentStatusPayload,
  UploadPodPayload,
} from "../types";

/**
 * The only import surface feature code (hooks, pages) should use for
 * shipments. Swapping `VITE_USE_MOCK_API` to false switches every consumer
 * to the real backend with no call-site changes — same pattern as
 * `features/auth/services/auth.service.ts`.
 */
export const shipmentService = {
  list: (filters: ShipmentListFilters) => (env.useMockApi ? shipmentMockService.list(filters) : shipmentApi.list(filters)),

  detail: (id: string) => (env.useMockApi ? shipmentMockService.detail(id) : shipmentApi.detail(id)),

  stats: () => (env.useMockApi ? shipmentMockService.stats() : shipmentApi.stats()),

  create: (payload: CreateShipmentPayload) => (env.useMockApi ? shipmentMockService.create(payload) : shipmentApi.create(payload)),

  updateStatus: (payload: UpdateShipmentStatusPayload) =>
    env.useMockApi ? shipmentMockService.updateStatus(payload) : shipmentApi.updateStatus(payload),

  assignDriver: (payload: AssignDriverPayload) =>
    env.useMockApi ? shipmentMockService.assignDriver(payload) : shipmentApi.assignDriver(payload),

  uploadPod: (payload: UploadPodPayload) => (env.useMockApi ? shipmentMockService.uploadPod(payload) : shipmentApi.uploadPod(payload)),
};
