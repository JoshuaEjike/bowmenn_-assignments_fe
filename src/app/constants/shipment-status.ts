import type { ShipmentStatus } from "@/app/types/domain";
import {
  Clock,
  UserCheck,
  ThumbsUp,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from "lucide-react";

export interface ShipmentStatusMeta {
  label: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind classes for the status badge, kept together so a status is one lookup, not five. */
  badgeClassName: string;
  dotClassName: string;
  order: number;
}

export const SHIPMENT_STATUS_META: Record<ShipmentStatus, ShipmentStatusMeta> = {
  pending_booking: {
    label: "Pending booking",
    description: "Waiting to be assigned to a driver.",
    icon: Clock,
    badgeClassName: "bg-muted text-muted-foreground border-border",
    dotClassName: "bg-muted-foreground",
    order: 0,
  },
  pending: {
    label: "Pending booking",
    description: "Waiting to be assigned to a driver.",
    icon: Clock,
    badgeClassName: "bg-muted text-muted-foreground border-border",
    dotClassName: "bg-muted-foreground",
    order: 0,
  },
  assigned: {
    label: "Assigned",
    description: "A driver has been assigned and notified.",
    icon: UserCheck,
    badgeClassName: "bg-primary-50 text-primary-700 border-primary-200",
    dotClassName: "bg-primary-500",
    order: 1,
  },
  accepted: {
    label: "Accepted",
    description: "The driver has accepted the shipment.",
    icon: ThumbsUp,
    badgeClassName: "bg-accent-50 text-accent-700 border-accent-200",
    dotClassName: "bg-accent-500",
    order: 2,
  },
  picked_up: {
    label: "Picked up",
    description: "Cargo has been collected from the pickup address.",
    icon: PackageCheck,
    badgeClassName: "bg-accent-100 text-accent-800 border-accent-200",
    dotClassName: "bg-accent-600",
    order: 3,
  },
  in_transit: {
    label: "In transit",
    description: "Cargo is on the road to its destination.",
    icon: Truck,
    badgeClassName: "bg-primary-100 text-primary-800 border-primary-200",
    dotClassName: "bg-primary-600",
    order: 4,
  },
  delivered: {
    label: "Delivered",
    description: "Cargo has arrived and proof of delivery is on file.",
    icon: CheckCircle2,
    badgeClassName: "bg-success/10 text-success border-success/30",
    dotClassName: "bg-success",
    order: 5,
  },
  cancelled: {
    label: "Cancelled",
    description: "This shipment was cancelled.",
    icon: XCircle,
    badgeClassName: "bg-danger/10 text-danger border-danger/30",
    dotClassName: "bg-danger",
    order: 6,
  },
};

/** The linear happy-path lifecycle, used to render progress timelines. */
export const SHIPMENT_LIFECYCLE: ShipmentStatus[] = [
  "pending_booking",
  "assigned",
  "accepted",
  "picked_up",
  "in_transit",
  "delivered",
];

export function isTerminalStatus(status: ShipmentStatus): boolean {
  return status === "delivered" || status === "cancelled";
}
