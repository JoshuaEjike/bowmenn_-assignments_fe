import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import type { AdminCustomerProfile } from "@/features/admin/types";
import { EmptyState } from "@/components/empty/empty-state";
import { TableSkeleton } from "@/components/loaders/table-skeleton";
import { formatDate } from "@/app/utils/format";
import { ROUTES } from "@/app/constants/routes";

export function CustomerTable({ customers, isLoading }: { customers: AdminCustomerProfile[]; isLoading?: boolean }) {
  if (isLoading) return <TableSkeleton columns={5} />;
  if (customers.length === 0) {
    return <EmptyState icon={Users} title="No customers found" description="No customers match your search yet." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Shipments</th>
            <th className="px-4 py-3 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/50">
              <td className="px-4 py-3">
                <Link to={ROUTES.admin.customerDetail(customer.id)} className="font-medium text-primary-700 hover:underline">
                  {customer.fullName}
                </Link>
                <span className="block text-xs text-muted-foreground">{customer.email}</span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{customer.companyName ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{customer.phone}</td>
              <td className="px-4 py-3 text-foreground">{customer.totalShipments}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(customer.joinedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
