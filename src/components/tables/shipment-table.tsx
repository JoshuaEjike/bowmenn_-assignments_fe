import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Shipment } from "@/app/types/domain";
import { ShipmentStatusBadge } from "@/components/status/shipment-status-badge";
import { formatCurrency, formatDate, formatWeight } from "@/app/utils/format";
import { Package } from "lucide-react";
import { EmptyState } from "@/components/empty/empty-state";
import { TableSkeleton } from "@/components/loaders/table-skeleton";

interface ShipmentTableProps {
  shipments: Shipment[];
  isLoading?: boolean;
  detailHref: (shipment: Shipment) => string;
  renderActions?: (shipment: Shipment) => ReactNode;
  emptyDescription?: string;
}

export function ShipmentTable({
  shipments,
  isLoading,
  detailHref,
  renderActions,
  emptyDescription,
}: ShipmentTableProps) {
  if (isLoading) return <TableSkeleton columns={6} />;

  if (shipments?.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No shipments found"
        description={emptyDescription ?? "Nothing matches your current filters yet."}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Reference</th>
            <th className="px-4 py-3 font-medium">Route</th>
            <th className="px-4 py-3 font-medium">Cargo</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Est. value</th>
            <th className="px-4 py-3 font-medium">Pickup date</th>
            {renderActions && <th className="px-4 py-3 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {shipments?.map((shipment) => (
            <tr key={shipment?.id} className="border-b border-border last:border-0 hover:bg-muted/50">
              <td className="px-4 py-3">
                <Link
                  to={detailHref(shipment)}
                  className="font-mono text-sm font-medium text-primary-700 hover:underline"
                >
                  {shipment?.reference}
                </Link>
              </td>
              <td className="px-4 py-3 text-foreground">
                {shipment?.pickup?.city} <span className="text-muted-foreground">→</span>{" "}
                {shipment?.delivery?.city}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {shipment?.cargoDescription}
                <span className="block text-xs">{formatWeight(shipment?.cargoWeightKg)}</span>
              </td>
              <td className="px-4 py-3">
                <ShipmentStatusBadge status={shipment?.status} />
              </td>
              <td className="px-4 py-3 font-medium text-foreground">
                {formatCurrency(shipment?.priceEstimate)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(shipment?.requestedPickupDate)}</td>
              {renderActions && <td className="px-4 py-3 text-right">{renderActions(shipment)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
