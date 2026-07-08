import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Truck, Users, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { ShipmentTable } from "@/components/tables/shipment-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/loaders/skeleton";
import { ROUTES } from "@/app/constants/routes";
import { useShipments, useShipmentStats } from "@/features/shipment/hooks/use-shipments";

export function AdminDashboardPage() {
  const [filters] = useState({ page: 1, pageSize: 8 });
  const stats = useShipmentStats("admin");
  const recent = useShipments(filters);

  return (
    <div>
      <PageHeader title="Operations overview" description="Platform-wide shipment activity, at a glance." />

      {stats.isError ? (
        <ErrorState message="Couldn't load platform stats." onRetry={() => stats.refetch()} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[104px] rounded-xl" />)
          ) : (
            <>
              <StatCard label="Total shipments" value={String(stats.data?.total ?? 0)} icon={Package} accent="primary" />
              <StatCard label="Active on the road" value={String(stats.data?.active ?? 0)} icon={Truck} accent="accent" />
              <StatCard label="Delivered" value={String(stats.data?.delivered ?? 0)} icon={CheckCircle2} accent="success" />
              <StatCard label="Awaiting dispatch" value={String(stats.data?.pendingBooking ?? 0)} icon={Users} accent="warning" />
            </>
          )}
        </div>
      )}

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent shipments</CardTitle>
          <Button variant="link" asChild>
            <Link to={ROUTES.admin.shipments}>View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recent.isError ? (
            <ErrorState message="Couldn't load shipments." onRetry={() => recent.refetch()} />
          ) : (
            <ShipmentTable
              shipments={recent.data?.items ?? []}
              isLoading={recent.isLoading}
              detailHref={(shipment) => ROUTES.admin.shipmentDetail(shipment.id)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
