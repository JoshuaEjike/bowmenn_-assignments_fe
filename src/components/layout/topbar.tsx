import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, LogOut, Menu, Settings, UserCircle } from "lucide-react";
import { useAuthStore } from "@/app/stores/auth.store";
import { useUIStore } from "@/app/stores/ui.store";
import { useNotificationStore } from "@/app/stores/notification.store";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/app/utils/format";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/constants/routes";

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const logout = useLogout();

  const profileHref =
    user?.role === "admin"
      ? ROUTES.admin.dashboard
      : user?.role === "driver"
        ? ROUTES.driver.profile
        : ROUTES.customer.profile;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-display text-lg font-semibold text-foreground lg:hidden">Bowmenn</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-accent-500" />
          )}
        </Button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="flex items-center gap-2 rounded-md p-1 pr-2 hover:bg-muted"
              aria-label="Account menu"
            >
              <Avatar>
                <AvatarFallback>{user ? getInitials(user.firstName, user.lastName) : "?"}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-foreground sm:inline">{user?.firstName}</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-56 rounded-md border border-border bg-surface p-1 shadow-raised"
            >
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item asChild>
                <Link
                  to={profileHref}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground outline-none hover:bg-muted"
                >
                  <UserCircle className="h-4 w-4" /> Profile
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground outline-none hover:bg-muted">
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item
                onSelect={() => logout()}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-danger outline-none hover:bg-danger/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
