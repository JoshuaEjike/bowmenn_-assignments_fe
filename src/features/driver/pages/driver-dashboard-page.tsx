import { useState } from "react";
import { Link } from "react-router-dom";
import { PackageCheck, ThumbsDown, ThumbsUp, Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ShipmentTable } from "@/components/tables/shipment-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/error-state";
import { ROUTES } from "@/app/constants/routes";
import { useShipments, useUpdateShipmentStatus } from "@/features/shipment/hooks/use-shipments";
import { SHIPMENT_LIFECYCLE } from "@/app/constants/shipment-status";
import type { ShipmentStatus } from "@/app/types/domain";
import { useAuthStore } from "@/app/stores/auth.store";

function nextStatus(current: ShipmentStatus): ShipmentStatus | null {
  const index = SHIPMENT_LIFECYCLE.indexOf(current);
  return index >= 0 && index < SHIPMENT_LIFECYCLE.length - 1 ? (SHIPMENT_LIFECYCLE[index + 1] ?? null) : null;
}

export function DriverDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [queueFilters] = useState({ page: 1, pageSize: 5, status: "assigned" as const });
  const [activeFilters] = useState({ page: 1, pageSize: 5, status: "in_transit" as const });

  const queue = useShipments({ ...queueFilters, user: user?.id });
  const active = useShipments({ ...activeFilters, user: user?.id });
  const updateStatus = useUpdateShipmentStatus();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your shipment queue"
        description="Accept assignments and move active loads forward."
      />

      <Card>
        <CardHeader>
          <CardTitle>Awaiting your response</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {queue.isError ? (
            <ErrorState message="Couldn't load your assignments." onRetry={() => queue.refetch()} />
          ) : (
            <ShipmentTable
              shipments={queue.data?.items ?? []}
              isLoading={queue.isLoading}
              detailHref={(shipment) => ROUTES.driver.shipmentDetail(shipment.id)}
              emptyDescription="No new assignments waiting on you right now."
              renderActions={(shipment) => (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={updateStatus.isPending}
                    onClick={() =>
                      updateStatus.mutate({
                        shipmentId: shipment.id,
                        status: "cancelled",
                        note: "Rejected by driver",
                      })
                    }
                  >
                    <ThumbsDown className="h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    isLoading={updateStatus.isPending}
                    className="text-white"
                    onClick={() => updateStatus.mutate({ shipmentId: shipment.id, status: "accepted" })}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" /> Accept
                  </Button>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>In transit</CardTitle>
          <Button variant="link" asChild>
            <Link to={ROUTES.driver.shipments}>View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {active.isError ? (
            <ErrorState message="Couldn't load active shipments." onRetry={() => active.refetch()} />
          ) : (
            <ShipmentTable
              shipments={active.data?.items ?? []}
              isLoading={active.isLoading}
              detailHref={(shipment) => ROUTES.driver.shipmentDetail(shipment.id)}
              emptyDescription="Nothing on the road right now."
              renderActions={(shipment) => {
                const next = nextStatus(shipment.status);
                return next ? (
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={updateStatus.isPending}
                    onClick={() => updateStatus.mutate({ shipmentId: shipment.id, status: next })}
                  >
                    {next === "delivered" ? (
                      <PackageCheck className="h-3.5 w-3.5" />
                    ) : (
                      <Truck className="h-3.5 w-3.5" />
                    )}
                    Mark {next.replace("_", " ")}
                  </Button>
                ) : null;
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
