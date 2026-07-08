import { mockDelay, paginate, matchesSearch } from "@/app/lib/mock-api";
import type { AdminListFilters, AdminCustomerProfile, AdminDriverProfile } from "../types";

const drivers: AdminDriverProfile[] = [
  {
    id: "drv_1",
    fullName: "Tunde Bello",
    email: "driver@bowmenn.com",
    phone: "+2348023456789",
    vehiclePlate: "LSD 442 KJ",
    truckType: "box_truck",
    rating: 4.8,
    totalDeliveries: 132,
    isActive: true,
    joinedAt: "2024-02-14T09:00:00.000Z",
  },
  {
    id: "drv_2",
    fullName: "Grace Adeyemi",
    email: "grace.adeyemi@bowmenn.com",
    phone: "+2348045671234",
    vehiclePlate: "ABJ 118 XZ",
    truckType: "flatbed",
    rating: 4.6,
    totalDeliveries: 98,
    isActive: true,
    joinedAt: "2024-04-02T09:00:00.000Z",
  },
  {
    id: "drv_3",
    fullName: "Musa Ibrahim",
    email: "musa.ibrahim@bowmenn.com",
    phone: "+2348056782345",
    vehiclePlate: "KAN 903 QR",
    truckType: "refrigerated",
    rating: 4.9,
    totalDeliveries: 201,
    isActive: false,
    joinedAt: "2023-11-20T09:00:00.000Z",
  },
];

const customers: AdminCustomerProfile[] = [
  {
    id: "user_customer_1",
    fullName: "Ifeoma Chukwu",
    companyName: "Chukwu Trading Co.",
    email: "customer@bowmenn.com",
    phone: "+2348034567890",
    totalShipments: 47,
    joinedAt: "2024-03-20T09:00:00.000Z",
  },
  {
    id: "cust_2",
    fullName: "David Okonkwo",
    companyName: "Okonkwo Imports",
    email: "david.okonkwo@example.com",
    phone: "+2348067893456",
    totalShipments: 19,
    joinedAt: "2024-06-11T09:00:00.000Z",
  },
  {
    id: "cust_3",
    fullName: "Fatima Yusuf",
    companyName: undefined,
    email: "fatima.yusuf@example.com",
    phone: "+2348078904567",
    totalShipments: 6,
    joinedAt: "2024-09-02T09:00:00.000Z",
  },
];

export const adminMockService = {
  async listDrivers(filters: AdminListFilters) {
    await mockDelay();
    const filtered = drivers.filter((d) =>
      matchesSearch([d.fullName, d.email, d?.vehiclePlate ?? ""], filters.search),
    );
    return paginate(filtered, filters);
  },

  async getDriver(id: string): Promise<AdminDriverProfile> {
    await mockDelay(300);
    const driver = drivers.find((d) => d.id === id);
    if (!driver) throw { message: "Driver not found.", code: "NOT_FOUND", status: 404 };
    return driver;
  },

  async listCustomers(filters: AdminListFilters) {
    await mockDelay();
    const filtered = customers.filter((c) =>
      matchesSearch([c.fullName, c.email, c.companyName ?? ""], filters.search),
    );
    return paginate(filtered, filters);
  },

  async getCustomer(id: string): Promise<AdminCustomerProfile> {
    await mockDelay(300);
    const customer = customers.find((c) => c.id === id);
    if (!customer) throw { message: "Customer not found.", code: "NOT_FOUND", status: 404 };
    return customer;
  },

  listAllDrivers: () => drivers,
};
