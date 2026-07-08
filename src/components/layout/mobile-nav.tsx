import * as Dialog from "@radix-ui/react-dialog";
import { NavLink } from "react-router-dom";
import { Truck, X } from "lucide-react";
import { cn } from "@/app/lib/cn";
import { useUIStore } from "@/app/stores/ui.store";
import { useAuthStore } from "@/app/stores/auth.store";
import { NAV_ITEMS_BY_ROLE } from "./nav-config";

export function MobileNav() {
  const isOpen = useUIStore((state) => state.isMobileNavOpen);
  const setOpen = useUIStore((state) => state.setMobileNavOpen);
  const role = useAuthStore((state) => state.user?.role);
  const items = role ? NAV_ITEMS_BY_ROLE[role] : [];

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-primary-900/40 lg:hidden" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface p-3 lg:hidden">
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <div className="flex items-center justify-between px-1 py-2">
            <span className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-800 text-primary-foreground">
                <Truck className="h-4 w-4" />
              </span>
              Bowmenn
            </span>
            <Dialog.Close aria-label="Close navigation" className="rounded-md p-1.5 hover:bg-muted">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <nav className="mt-2 flex-1 space-y-1">
            {items.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                    isActive && "bg-primary-50 text-primary-800",
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
