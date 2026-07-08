import { useParams } from "react-router-dom";
import { Building2, Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ErrorState } from "@/components/feedback/error-state";
import { ShipmentTable } from "@/components/tables/shipment-table";
import { Skeleton } from "@/components/loaders/skeleton";
import { useAdminCustomer } from "@/features/admin/hooks/use-admin";
import { useShipments } from "@/features/shipment/hooks/use-shipments";
import { getInitials, formatDate } from "@/app/utils/format";
import { ROUTES } from "@/app/constants/routes";

export function AdminCustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const { data: customer, isLoading, isError, refetch } = useAdminCustomer(customerId);
  const shipments = useShipments({ page: 1, pageSize: 10 });

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }
  if (isError || !customer) {
    return <ErrorState message="Couldn't load this customer." onRetry={() => refetch()} />;
  }

  const [firstName, lastName] = customer.fullName.split(" ");

  return (
    <div>
      <PageHeader
        title={customer.fullName}
        description="Customer profile and shipment history."
        breadcrumbs={[{ label: "Customers", href: ROUTES.admin.customers }, { label: customer.fullName }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="h-fit lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{getInitials(firstName ?? "", lastName ?? "")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">{customer.fullName}</p>
              {customer.companyName && <p className="text-sm text-muted-foreground">{customer.companyName}</p>}
            </div>
            <div className="w-full space-y-2 border-t border-border pt-4 text-left text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> {customer.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> {customer.phone}
              </p>
              {customer.companyName && (
                <p className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> {customer.companyName}
                </p>
              )}
              <p>Customer since {formatDate(customer.joinedAt)}</p>
              <p>{customer.totalShipments} total shipments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent shipments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {shipments.isError ? (
              <ErrorState message="Couldn't load shipments." onRetry={() => shipments.refetch()} />
            ) : (
              <ShipmentTable
                shipments={shipments.data?.items ?? []}
                isLoading={shipments.isLoading}
                detailHref={(shipment) => ROUTES.admin.shipmentDetail(shipment.id)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
