import { SHIPMENT_STATUS_META } from "@/app/constants/shipment-status";
import type { ShipmentStatus } from "@/app/types/domain";
import { cn } from "@/app/lib/cn";
import * as Tooltip from "@radix-ui/react-tooltip";

export function ShipmentStatusBadge({ status, className }: { status: ShipmentStatus; className?: string }) {
  const meta = SHIPMENT_STATUS_META[status];

  if (!meta) {
    return <span className="inline-flex rounded-full border px-2.5 py-0.5 text-xs">{status}</span>;
  }

  const Icon = meta?.icon;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
              meta.badgeClassName,
              className,
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {meta?.label}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={6}
            className="z-50 max-w-64 rounded-md bg-primary-800 px-3 py-1.5 text-xs text-primary-foreground shadow-raised"
          >
            {meta?.description}
            <Tooltip.Arrow className="fill-primary-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
