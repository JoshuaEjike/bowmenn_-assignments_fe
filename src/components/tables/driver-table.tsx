import { Link } from "react-router-dom";
import { Star, Truck } from "lucide-react";
import type { AdminDriverProfile } from "@/features/admin/types";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty/empty-state";
import { TableSkeleton } from "@/components/loaders/table-skeleton";
import { formatDate } from "@/app/utils/format";
import { ROUTES } from "@/app/constants/routes";

export function DriverTable({ drivers, isLoading }: { drivers: AdminDriverProfile[]; isLoading?: boolean }) {
  if (isLoading) return <TableSkeleton columns={6} />;
  if (drivers.length === 0) {
    return (
      <EmptyState icon={Truck} title="No drivers found" description="No drivers match your search yet." />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Driver</th>
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Deliveries</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id} className="border-b border-border last:border-0 hover:bg-muted/50">
              <td className="px-4 py-3">
                <Link
                  to={ROUTES.admin.driverDetail(driver.id)}
                  className="font-medium text-primary-700 hover:underline"
                >
                  {driver.fullName}
                </Link>
                <span className="block text-xs text-muted-foreground">{driver.email}</span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {driver.vehiclePlate}
                <span className="block text-xs capitalize">{driver?.truckType?.replace("_", " ")}</span>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 text-foreground">
                  <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />{" "}
                  {driver?.rating?.toFixed(1)}
                </span>
              </td>
              <td className="px-4 py-3 text-foreground">{driver.totalDeliveries}</td>
              <td className="px-4 py-3">
                <Badge variant={driver.isActive ? "success" : "neutral"}>
                  {driver.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(driver.joinedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
