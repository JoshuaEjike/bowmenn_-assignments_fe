import { SearchInput } from "./search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SHIPMENT_STATUS_META } from "@/app/constants/shipment-status";
import { SHIPMENT_STATUSES, type ShipmentStatus } from "@/app/types/domain";
import { env } from "@/app/config/env";

interface ShipmentFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: ShipmentStatus | "all";
  onStatusChange: (value: ShipmentStatus | "all") => void;
}

export function ShipmentFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: ShipmentFilterBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="sm:max-w-xs sm:flex-1">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search by reference, cargo, customer…"
        />
      </div>
      <Select value={status} onValueChange={(value) => onStatusChange(value as ShipmentStatus | "all")}>
        <SelectTrigger className="sm:w-52">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {SHIPMENT_STATUSES.map((s) => {
            if (s === "pending_booking" && !env.useMockApi) return;

            if (s === "pending" && env.useMockApi) return;

            return (
              <SelectItem key={s} value={s}>
                {SHIPMENT_STATUS_META[s].label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
