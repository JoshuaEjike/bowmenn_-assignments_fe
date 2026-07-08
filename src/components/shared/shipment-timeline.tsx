import { SHIPMENT_STATUS_META } from "@/app/constants/shipment-status";
import type { ShipmentTimelineEvent } from "@/app/types/domain";
import { formatDateTime } from "@/app/utils/format";
import { cn } from "@/app/lib/cn";

/**
 * The route-line signature: a vertical dashed line connecting status nodes,
 * echoing the line on a freight route map. Completed nodes are solid,
 * the current node pulses, future nodes stay hollow.
 */
export function ShipmentTimeline({ events }: { events: ShipmentTimelineEvent[] }) {
  return (
    <ol className="relative">
      {events.map((event, index) => {
        console.log(event?.status, "event?.status___event?.status");

        const meta = SHIPMENT_STATUS_META[event?.status];

        if (!meta) {
          return (
            <span className="inline-flex rounded-full border px-2.5 py-0.5 text-xs">{event?.status}</span>
          );
        }

        const Icon = meta?.icon;
        const isLast = index === events.length - 1;

        return (
          <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[15px] top-8 h-[calc(100%-1.75rem)] w-px border-l-2 border-dashed border-primary-200"
              />
            )}
            <span
              className={cn(
                "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                isLast
                  ? "border-accent-500 bg-accent-50 text-accent-700"
                  : "border-primary-300 bg-primary-50 text-primary-700",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="pt-1">
              <p className="text-sm font-medium text-foreground">{meta.label}</p>
              {event.note && <p className="text-sm text-muted-foreground">{event.note}</p>}
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDateTime(event.timestamp)}
                {event.actorName ? ` · ${event.actorName}` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
