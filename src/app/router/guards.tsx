import type { PropsWithChildren } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/app/stores/auth.store";
import { ROUTES } from "@/app/constants/routes";
import type { UserRole } from "@/app/types/domain";

/** Blocks unauthenticated users, remembering where they were headed. */
export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }
  return children ? <>{children}</> : <Outlet />;
}

/** Blocks any authenticated user whose role isn't in the allow-list. */
export function RoleRoute({ allow }: { allow: UserRole[] }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to={ROUTES.login} replace />;
  if (!allow.includes(user.role)) return <Navigate to={ROUTES.forbidden} replace />;

  return <Outlet />;
}

/** Keeps already-authenticated users off the public auth pages. */
export function PublicOnlyRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated && user) {
    const home =
      user.role === "admin" ? ROUTES.admin.dashboard : user.role === "driver" ? ROUTES.driver.dashboard : ROUTES.customer.dashboard;
    return <Navigate to={home} replace />;
  }
  return children ? <>{children}</> : <Outlet />;
}
