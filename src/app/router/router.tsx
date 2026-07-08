import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ROUTES } from "@/app/constants/routes";
import { AuthLayout } from "@/components/layout/auth-layout";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProtectedRoute, PublicOnlyRoute, RoleRoute } from "./guards";
import { RouteFallback } from "./route-fallback";
import { NotFoundPage } from "./pages/not-found-page";
import { ForbiddenPage } from "./pages/forbidden-page";
import { UnauthorizedPage } from "./pages/unauthorized-page";

// --- Auth pages ---
const LoginPage = lazy(() =>
  import("@/features/auth/pages/login-page").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("@/features/auth/pages/register-page").then((m) => ({ default: m.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/forgot-password-page").then((m) => ({ default: m.ForgotPasswordPage })),
);
const VerifyOtpPage = lazy(() =>
  import("@/features/auth/pages/verify-otp-page").then((m) => ({ default: m.VerifyOtpPage })),
);
const ResetPasswordPage = lazy(() =>
  import("@/features/auth/pages/reset-password-page").then((m) => ({ default: m.ResetPasswordPage })),
);

// --- Customer pages ---
const CustomerDashboardPage = lazy(() =>
  import("@/features/customer/pages/customer-dashboard-page").then((m) => ({
    default: m.CustomerDashboardPage,
  })),
);
const CustomerShipmentsPage = lazy(() =>
  import("@/features/customer/pages/customer-shipments-page").then((m) => ({
    default: m.CustomerShipmentsPage,
  })),
);
const CustomerShipmentNewPage = lazy(() =>
  import("@/features/customer/pages/customer-shipment-new-page").then((m) => ({
    default: m.CustomerShipmentNewPage,
  })),
);
const CustomerShipmentDetailPage = lazy(() =>
  import("@/features/customer/pages/customer-shipment-detail-page").then((m) => ({
    default: m.CustomerShipmentDetailPage,
  })),
);
const CustomerProfilePage = lazy(() =>
  import("@/features/customer/pages/customer-profile-page").then((m) => ({ default: m.CustomerProfilePage })),
);

// --- Driver pages ---
const DriverDashboardPage = lazy(() =>
  import("@/features/driver/pages/driver-dashboard-page").then((m) => ({ default: m.DriverDashboardPage })),
);
const DriverShipmentsPage = lazy(() =>
  import("@/features/driver/pages/driver-shipments-page").then((m) => ({ default: m.DriverShipmentsPage })),
);
const DriverShipmentDetailPage = lazy(() =>
  import("@/features/driver/pages/driver-shipment-detail-page").then((m) => ({
    default: m.DriverShipmentDetailPage,
  })),
);
const DriverProfilePage = lazy(() =>
  import("@/features/driver/pages/driver-profile-page").then((m) => ({ default: m.DriverProfilePage })),
);

// --- Admin pages ---
const AdminDashboardPage = lazy(() =>
  import("@/features/admin/pages/admin-dashboard-page").then((m) => ({ default: m.AdminDashboardPage })),
);
const AdminShipmentsPage = lazy(() =>
  import("@/features/admin/pages/admin-shipments-page").then((m) => ({ default: m.AdminShipmentsPage })),
);
const AdminShipmentDetailPage = lazy(() =>
  import("@/features/admin/pages/admin-shipment-detail-page").then((m) => ({
    default: m.AdminShipmentDetailPage,
  })),
);
const AdminCustomersPage = lazy(() =>
  import("@/features/admin/pages/admin-customers-page").then((m) => ({ default: m.AdminCustomersPage })),
);
const AdminCustomerDetailPage = lazy(() =>
  import("@/features/admin/pages/admin-customer-detail-page").then((m) => ({
    default: m.AdminCustomerDetailPage,
  })),
);
const AdminDriversPage = lazy(() =>
  import("@/features/admin/pages/admin-drivers-page").then((m) => ({ default: m.AdminDriversPage })),
);
const AdminDriverDetailPage = lazy(() =>
  import("@/features/admin/pages/admin-driver-detail-page").then((m) => ({
    default: m.AdminDriverDetailPage,
  })),
);

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  { path: ROUTES.root, element: <Navigate to={ROUTES.login} replace /> },

  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.login, element: withSuspense(<LoginPage />) },
          { path: ROUTES.register, element: withSuspense(<RegisterPage />) },
          { path: ROUTES.forgotPassword, element: withSuspense(<ForgotPasswordPage />) },
          { path: ROUTES.verifyOtp, element: withSuspense(<VerifyOtpPage />) },
          { path: ROUTES.resetPassword, element: withSuspense(<ResetPasswordPage />) },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allow={["customer"]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: ROUTES.customer.dashboard, element: withSuspense(<CustomerDashboardPage />) },
              { path: ROUTES.customer.shipments, element: withSuspense(<CustomerShipmentsPage />) },
              { path: ROUTES.customer.shipmentNew, element: withSuspense(<CustomerShipmentNewPage />) },
              {
                path: ROUTES.customer.shipmentDetail(),
                element: withSuspense(<CustomerShipmentDetailPage />),
              },
              { path: ROUTES.customer.profile, element: withSuspense(<CustomerProfilePage />) },
            ],
          },
        ],
      },
      {
        element: <RoleRoute allow={["driver"]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: ROUTES.driver.dashboard, element: withSuspense(<DriverDashboardPage />) },
              { path: ROUTES.driver.shipments, element: withSuspense(<DriverShipmentsPage />) },
              { path: ROUTES.driver.shipmentDetail(), element: withSuspense(<DriverShipmentDetailPage />) },
              { path: ROUTES.driver.profile, element: withSuspense(<DriverProfilePage />) },
            ],
          },
        ],
      },
      {
        element: <RoleRoute allow={["admin"]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: ROUTES.admin.dashboard, element: withSuspense(<AdminDashboardPage />) },
              { path: ROUTES.admin.shipments, element: withSuspense(<AdminShipmentsPage />) },
              { path: ROUTES.admin.shipmentDetail(), element: withSuspense(<AdminShipmentDetailPage />) },
              { path: ROUTES.admin.customers, element: withSuspense(<AdminCustomersPage />) },
              { path: ROUTES.admin.customerDetail(), element: withSuspense(<AdminCustomerDetailPage />) },
              { path: ROUTES.admin.drivers, element: withSuspense(<AdminDriversPage />) },
              { path: ROUTES.admin.driverDetail(), element: withSuspense(<AdminDriverDetailPage />) },
            ],
          },
        ],
      },
    ],
  },

  { path: ROUTES.unauthorized, element: <UnauthorizedPage /> },
  { path: ROUTES.forbidden, element: <ForbiddenPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
