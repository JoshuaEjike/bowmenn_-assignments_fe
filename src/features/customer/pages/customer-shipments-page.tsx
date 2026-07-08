import { useState } from "react";
import { Link } from "react-router-dom";
import { PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShipmentFilterBar } from "@/components/forms/shipment-filter-bar";
import { ShipmentTable } from "@/components/tables/shipment-table";
import { Pagination } from "@/components/tables/pagination";
import { ErrorState } from "@/components/feedback/error-state";
import { useShipments } from "@/features/shipment/hooks/use-shipments";
import { ROUTES } from "@/app/constants/routes";
import type { ShipmentStatus } from "@/app/types/domain";
import { useDebouncedCallback } from "use-debounce";
import { useAuthStore } from "@/app/stores/auth.store";

export function CustomerShipmentsPage() {
  const user = useAuthStore((state) => state.user);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ShipmentStatus | "all">("all");

  const shipments = useShipments({ user: user?.id, page, pageSize: 10, search, status });

  const debounced = useDebouncedCallback(async (_) => {
    shipments.refetch();
  }, 1000);

  return (
    <div>
      <PageHeader
        title="Your shipments"
        description="Every shipment you've booked, from pending to delivered."
        actions={
          <Button asChild>
            <Link
              to={ROUTES.customer.shipmentNew}
              className="text-white flex gap-2 items-center justify-center"
            >
              <PackagePlus /> New shipment
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4 sm:p-6">
          <ShipmentFilterBar
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);

              if (value) {
                debounced(value);
              }
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
            <ErrorState message="Couldn't load your shipments." onRetry={() => shipments.refetch()} />
          ) : (
            <>
              <ShipmentTable
                shipments={shipments?.data?.items ?? []}
                isLoading={shipments?.isLoading}
                detailHref={(shipment) => ROUTES.customer.shipmentDetail(shipment?.id)}
                emptyDescription="No shipments match your filters yet."
              />
              {shipments?.data && shipments?.data?.totalItems > 0 && (
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
    </div>
  );
}
