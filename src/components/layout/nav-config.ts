import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  UserCircle,
  PackagePlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROUTES } from "@/app/constants/routes";
import type { UserRole } from "@/app/types/domain";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS_BY_ROLE: Record<UserRole, NavItem[]> = {
  customer: [
    { label: "Dashboard", href: ROUTES.customer.dashboard, icon: LayoutDashboard },
    { label: "Shipments", href: ROUTES.customer.shipments, icon: Package },
    { label: "New shipment", href: ROUTES.customer.shipmentNew, icon: PackagePlus },
    { label: "Profile", href: ROUTES.customer.profile, icon: UserCircle },
  ],
  driver: [
    { label: "Dashboard", href: ROUTES.driver.dashboard, icon: LayoutDashboard },
    { label: "My shipments", href: ROUTES.driver.shipments, icon: Package },
    { label: "Profile", href: ROUTES.driver.profile, icon: UserCircle },
  ],
  admin: [
    { label: "Overview", href: ROUTES.admin.dashboard, icon: LayoutDashboard },
    { label: "Shipments", href: ROUTES.admin.shipments, icon: Package },
    { label: "Drivers", href: ROUTES.admin.drivers, icon: Truck },
    { label: "Customers", href: ROUTES.admin.customers, icon: Users },
  ],
};
