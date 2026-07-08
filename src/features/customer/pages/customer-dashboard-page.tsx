import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, Truck, CheckCircle2, PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { ShipmentTable } from "@/components/tables/shipment-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/loaders/skeleton";
import { ROUTES } from "@/app/constants/routes";
import { useAuthStore } from "@/app/stores/auth.store";
import { useShipments, useShipmentStats } from "@/features/shipment/hooks/use-shipments";

export function CustomerDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [filters] = useState({ page: 1, pageSize: 5 });

  const stats = useShipmentStats(`customer-${user?.id}`);

  const recent = useShipments({ ...filters, user: user?.id });

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName ?? "there"}`}
        description="Here's what's moving across your shipments today."
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

      {stats?.isError ? (
        <ErrorState message="Couldn't load your shipment stats." onRetry={() => stats?.refetch()} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats?.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[104px] rounded-xl" />)
          ) : (
            <>
              <StatCard
                label="Total shipments"
                value={String(stats?.data?.total ?? 0)}
                icon={Package}
                accent="primary"
              />
              <StatCard
                label="Pending booking"
                value={String(stats?.data?.pendingBooking ?? 0)}
                icon={Clock}
                accent="warning"
              />
              <StatCard
                label="In progress"
                value={String(stats?.data?.active ?? 0)}
                icon={Truck}
                accent="accent"
              />
              <StatCard
                label="Delivered"
                value={String(stats?.data?.delivered ?? 0)}
                icon={CheckCircle2}
                accent="success"
              />
            </>
          )}
        </div>
      )}

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent shipments</CardTitle>
          <Button variant="link" asChild>
            <Link to={ROUTES.customer.shipments}>View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recent?.isError ? (
            <ErrorState message="Couldn't load your shipments." onRetry={() => recent?.refetch()} />
          ) : (
            <ShipmentTable
              shipments={recent?.data?.items ?? []}
              isLoading={recent?.isLoading}
              detailHref={(shipment) => ROUTES.customer.shipmentDetail(shipment.id)}
              emptyDescription="Book your first shipment to see it appear here."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
