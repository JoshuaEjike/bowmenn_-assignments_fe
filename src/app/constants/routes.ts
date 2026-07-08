/**
 * Single source of truth for every route in the app.
 * Never hardcode a path string elsewhere — import from here.
 */
export const ROUTES = {
  root: "/",

  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-otp",
  resetPassword: "/reset-password",

  unauthorized: "/unauthorized",
  forbidden: "/403",
  notFound: "/404",

  customer: {
    root: "/customer",
    dashboard: "/customer/dashboard",
    shipments: "/customer/shipments",
    shipmentNew: "/customer/shipments/new",
    shipmentDetail: (id = ":shipmentId") => `/customer/shipments/${id}`,
    profile: "/customer/profile",
  },

  driver: {
    root: "/driver",
    dashboard: "/driver/dashboard",
    shipments: "/driver/shipments",
    shipmentDetail: (id = ":shipmentId") => `/driver/shipments/${id}`,
    profile: "/driver/profile",
  },

  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    shipments: "/admin/shipments",
    shipmentDetail: (id = ":shipmentId") => `/admin/shipments/${id}`,
    customers: "/admin/customers",
    customerDetail: (id = ":customerId") => `/admin/customers/${id}`,
    drivers: "/admin/drivers",
    driverDetail: (id = ":driverId") => `/admin/drivers/${id}`,
  },
} as const;
