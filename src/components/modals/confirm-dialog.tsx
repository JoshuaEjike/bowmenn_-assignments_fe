import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonProps["variant"];
  isLoading?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-primary-900/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-6 shadow-raised data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <Dialog.Title className="text-base font-semibold text-foreground">{title}</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">{description}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 -mr-1 -mt-1" aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline" size="sm">
                {cancelLabel}
              </Button>
            </Dialog.Close>
            <Button variant={confirmVariant} size="sm" onClick={onConfirm} isLoading={isLoading}>
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
