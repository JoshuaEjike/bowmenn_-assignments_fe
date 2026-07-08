import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/app/constants/query-keys";
import { shipmentService } from "../services/shipment.service";
import type {
  ShipmentListFilters,
  UpdateShipmentStatusPayload,
  AssignDriverPayload,
  CreateShipmentPayload,
  UploadPodPayload,
} from "../types";
import type { ApiError } from "@/app/types/domain";

export function useShipments(filters: ShipmentListFilters) {
  return useQuery({
    queryKey: queryKeys.shipments.list(filters),
    queryFn: () => shipmentService.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useShipment(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.shipments.detail(id ?? ""),
    queryFn: () => shipmentService.detail(id as string),
    enabled: Boolean(id),
  });
}

export function useShipmentStats(role: string) {
  return useQuery({
    queryKey: queryKeys.shipments.stats(role),
    queryFn: () => shipmentService.stats(),
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateShipmentPayload) => shipmentService.create(payload),
    onSuccess: () => {
      toast.success("Shipment booked");
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all() });
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useUpdateShipmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateShipmentStatusPayload) => shipmentService.updateStatus(payload),
    onSuccess: (shipment) => {
      toast.success(`Shipment ${shipment.reference} updated`);
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all() });
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useAssignDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignDriverPayload) => shipmentService.assignDriver(payload),
    onSuccess: (shipment) => {
      toast.success(`${shipment.driver?.fullName} assigned to ${shipment.reference}`);
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all() });
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useUploadPod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UploadPodPayload) => shipmentService.uploadPod(payload),
    onSuccess: (shipment) => {
      toast.success(`Proof of delivery uploaded for ${shipment.reference}`);
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all() });
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}
