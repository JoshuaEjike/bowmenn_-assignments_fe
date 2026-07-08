import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShipmentFilterBar } from "@/components/forms/shipment-filter-bar";
import { ShipmentTable } from "@/components/tables/shipment-table";
import { Pagination } from "@/components/tables/pagination";
import { ErrorState } from "@/components/feedback/error-state";
import { AssignDriverModal } from "@/features/admin/components/assign-driver-modal";
import { useShipments } from "@/features/shipment/hooks/use-shipments";
import { ROUTES } from "@/app/constants/routes";
import type { Shipment, ShipmentStatus } from "@/app/types/domain";
import { UserPlus } from "lucide-react";

export function AdminShipmentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ShipmentStatus | "all">("all");
  const [assigningShipment, setAssigningShipment] = useState<Shipment | null>(null);

  const shipments = useShipments({ page, pageSize: 10, search, status });

  return (
    <div>
      <PageHeader title="All shipments" description="Monitor and dispatch every shipment on the platform." />

      <Card>
        <CardContent className="p-4 sm:p-6">
          <ShipmentFilterBar
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            status={status}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          />
        </CardContent>
        <div className="border-t border-border">
          {shipments.isError ? (
            <ErrorState message="Couldn't load shipments." onRetry={() => shipments.refetch()} />
          ) : (
            <>
              <ShipmentTable
                shipments={shipments.data?.items ?? []}
                isLoading={shipments.isLoading}
                detailHref={(shipment) => ROUTES.admin.shipmentDetail(shipment.id)}
                emptyDescription="No shipments match your filters yet."
                renderActions={(shipment) =>
                  shipment.status === "pending" ? (
                    <Button size="sm" variant="outline" onClick={() => setAssigningShipment(shipment)}>
                      <UserPlus className="h-3.5 w-3.5" /> Assign
                    </Button>
                  ) : null
                }
              />
              {shipments.data && shipments.data.totalItems > 0 && (
                <Pagination
                  page={shipments.data.page}
                  totalPages={shipments.data.totalPages}
                  totalItems={shipments.data.totalItems}
                  pageSize={shipments.data.pageSize}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </Card>

      {assigningShipment && (
        <AssignDriverModal
          open={Boolean(assigningShipment)}
          onOpenChange={(open) => !open && setAssigningShipment(null)}
          shipmentId={assigningShipment.id}
        />
      )}
    </div>
  );
}
