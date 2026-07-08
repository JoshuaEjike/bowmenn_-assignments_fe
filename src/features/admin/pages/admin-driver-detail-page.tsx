import { useParams } from "react-router-dom";
import { Mail, Phone, Star, Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/feedback/error-state";
import { ShipmentTable } from "@/components/tables/shipment-table";
import { Skeleton } from "@/components/loaders/skeleton";
import { useAdminDriver } from "@/features/admin/hooks/use-admin";
import { useShipments } from "@/features/shipment/hooks/use-shipments";
import { getInitials, formatDate } from "@/app/utils/format";
import { ROUTES } from "@/app/constants/routes";

export function AdminDriverDetailPage() {
  const { driverId } = useParams<{ driverId: string }>();
  const { data: driver, isLoading, isError, refetch } = useAdminDriver(driverId);
  const shipments = useShipments({ page: 1, pageSize: 10 });

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }
  if (isError || !driver) {
    return <ErrorState message="Couldn't load this driver." onRetry={() => refetch()} />;
  }

  const [firstName, lastName] = driver.fullName.split(" ");

  return (
    <div>
      <PageHeader
        title={driver.fullName}
        description="Driver profile, vehicle, and shipment history."
        breadcrumbs={[{ label: "Drivers", href: ROUTES.admin.drivers }, { label: driver.fullName }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="h-fit lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{getInitials(firstName ?? "", lastName ?? "")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">{driver.fullName}</p>
              <Badge variant={driver.isActive ? "success" : "neutral"} className="mt-1">
                {driver.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="w-full space-y-2 border-t border-border pt-4 text-left text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> {driver.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> {driver.phone}
              </p>
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> {driver.vehiclePlate ?? "No vehicle on file"}
                {driver.truckType && <span className="capitalize"> · {driver.truckType.replace("_", " ")}</span>}
              </p>
              <p className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-accent-500 text-accent-500" />{" "}
                {driver.rating !== undefined ? `${driver.rating.toFixed(1)} rating · ` : ""}
                {driver.totalDeliveries} deliveries
              </p>
              <p>Joined {formatDate(driver.joinedAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent shipments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {shipments.isError ? (
              <ErrorState message="Couldn't load shipments." onRetry={() => shipments.refetch()} />
            ) : (
              <ShipmentTable
                shipments={shipments.data?.items ?? []}
                isLoading={shipments.isLoading}
                detailHref={(shipment) => ROUTES.admin.shipmentDetail(shipment.id)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
