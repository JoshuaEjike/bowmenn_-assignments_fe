import { useState } from "react";
import { useParams } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ShipmentSummaryCard } from "@/components/cards/shipment-summary-card";
import { ShipmentTimeline } from "@/components/shared/shipment-timeline";
import { PodViewer } from "@/components/shared/pod-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/loaders/skeleton";
import { AssignDriverModal } from "@/features/admin/components/assign-driver-modal";
import { useShipment, useUpdateShipmentStatus } from "@/features/shipment/hooks/use-shipments";
import { SHIPMENT_STATUS_META } from "@/app/constants/shipment-status";
import { SHIPMENT_STATUSES, type ShipmentStatus } from "@/app/types/domain";
import { ROUTES } from "@/app/constants/routes";
import { env } from "@/app/config/env";

export function AdminShipmentDetailPage() {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const { data: shipment, isLoading, isError, refetch } = useShipment(shipmentId);
  const updateStatus = useUpdateShipmentStatus();
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState<ShipmentStatus | "">("");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !shipment) {
    return <ErrorState message="Couldn't load this shipment." onRetry={() => refetch()} />;
  }

  return (
    <div>
      <PageHeader
        title={shipment.reference}
        description="Full visibility and manual override for this shipment."
        breadcrumbs={[{ label: "Shipments", href: ROUTES.admin.shipments }, { label: shipment.reference }]}
        actions={
          shipment.status === "pending" ? (
            <Button className="text-white" onClick={() => setIsAssignOpen(true)}>
              <UserPlus /> Assign driver
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ShipmentSummaryCard shipment={shipment} />

          <Card>
            <CardHeader>
              <CardTitle>Override status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Select
                value={overrideStatus}
                onValueChange={(value) => setOverrideStatus(value as ShipmentStatus)}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Choose a new status" />
                </SelectTrigger>
                <SelectContent>
                  {SHIPMENT_STATUSES.map((s) => {
                    if (s?.toLowerCase() === "pending_booking" && env.useMockApi) return;

                    if (s?.toLowerCase() === "pending" && !env.useMockApi) return;

                    return (
                      <SelectItem key={s} value={s}>
                        {SHIPMENT_STATUS_META[s].label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                disabled={!overrideStatus || overrideStatus === shipment.status}
                isLoading={updateStatus.isPending}
                onClick={() => {
                  if (overrideStatus)
                    updateStatus.mutate({
                      shipmentId: shipment.id,
                      status: overrideStatus,
                      note: "Manually overridden by admin",
                    });
                }}
              >
                Apply override
              </Button>
            </CardContent>
          </Card>

          <PodViewer pod={shipment.proofOfDelivery} />
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ShipmentTimeline events={shipment.timeline} />
          </CardContent>
        </Card>
      </div>

      <AssignDriverModal open={isAssignOpen} onOpenChange={setIsAssignOpen} shipmentId={shipment.id} />
    </div>
  );
}
