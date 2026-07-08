import { NavLink } from "react-router-dom";
import { Truck, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/app/lib/cn";
import { useUIStore } from "@/app/stores/ui.store";
import { useAuthStore } from "@/app/stores/auth.store";
import { NAV_ITEMS_BY_ROLE } from "./nav-config";
import { ROUTES } from "@/app/constants/routes";

export function Sidebar() {
  const isCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const role = useAuthStore((state) => state.user?.role);

  const items = role ? NAV_ITEMS_BY_ROLE[role] : [];

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 lg:flex",
        isCollapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-800 text-primary-foreground">
          <Truck className="h-4 w-4" />
        </span>
        {!isCollapsed && <span className="font-display text-base font-semibold text-foreground">Bowmenn</span>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === ROUTES.customer.dashboard || item.href === ROUTES.driver.dashboard || item.href === ROUTES.admin.dashboard}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActive && "bg-primary-50 text-primary-800",
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggleSidebar}
        className="flex items-center gap-2 border-t border-border px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        {!isCollapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
