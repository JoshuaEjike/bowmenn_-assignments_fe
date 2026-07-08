import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllDrivers } from "@/features/admin/hooks/use-admin";
import { useAssignDriver } from "@/features/shipment/hooks/use-shipments";

interface AssignDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipmentId: string;
}

export function AssignDriverModal({ open, onOpenChange, shipmentId }: AssignDriverModalProps) {
  const [driverId, setDriverId] = useState<string>("");
  const drivers = useAllDrivers();
  const assignDriver = useAssignDriver();

  function handleAssign() {
    if (!driverId) return;
    assignDriver.mutate({ shipmentId, driverId }, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-primary-900/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-6 shadow-raised">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-base font-semibold text-foreground">Assign a driver</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                Choose an available driver to dispatch for this shipment.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="-mr-1 -mt-1 h-7 w-7" aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="mt-4">
            <Select value={driverId} onValueChange={setDriverId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                {(drivers.data ?? []).map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.fullName}
                    {driver.vehiclePlate ? ` · ${driver.vehiclePlate}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              size="sm"
              className="text-white"
              onClick={handleAssign}
              disabled={!driverId}
              isLoading={assignDriver.isPending}
            >
              Assign driver
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
