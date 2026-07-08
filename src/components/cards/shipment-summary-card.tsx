import type { ReactNode } from "react";
import { MapPin, Package, Truck as TruckIcon, User, Weight } from "lucide-react";
import type { Shipment } from "@/app/types/domain";
import { Card, CardContent } from "@/components/ui/card";
import { ShipmentStatusBadge } from "@/components/status/shipment-status-badge";
import { formatCurrency, formatDate, formatWeight } from "@/app/utils/format";

function Row({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function ShipmentSummaryCard({ shipment }: { shipment: Shipment }) {
  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-lg font-semibold text-foreground">{shipment?.reference}</p>
            <p className="text-xs text-muted-foreground">Booked {formatDate(shipment?.createdAt)}</p>
          </div>
          <ShipmentStatusBadge status={shipment.status} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Row
            icon={MapPin}
            label="Pickup"
            value={`${shipment.pickup.label} · ${shipment.pickup.city}, ${shipment.pickup.state}`}
          />
          <Row
            icon={MapPin}
            label="Delivery"
            value={`${shipment.delivery.label} · ${shipment.delivery.city}, ${shipment.delivery.state}`}
          />
          <Row icon={Package} label="Cargo" value={shipment.cargoDescription} />
          <Row icon={Weight} label="Weight" value={formatWeight(shipment.cargoWeightKg)} />
          <Row
            icon={TruckIcon}
            label="Driver"
            value={
              shipment.driver
                ? `${shipment.driver.fullName} · ${shipment.driver.vehiclePlate}`
                : "Not yet assigned"
            }
          />
          <Row icon={User} label="Customer" value={shipment.customer.fullName} />
        </div>

        <div className="flex flex-wrap gap-6 border-t border-border pt-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Estimated value</p>
            <p className="font-semibold text-foreground">{formatCurrency(shipment.priceEstimate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Distance</p>
            <p className="font-semibold text-foreground">{shipment.distanceKm} km</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Requested pickup</p>
            <p className="font-semibold text-foreground">{formatDate(shipment.requestedPickupDate)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
