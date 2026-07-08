import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/page-header";
import { ShipmentSummaryCard } from "@/components/cards/shipment-summary-card";
import { ShipmentTimeline } from "@/components/shared/shipment-timeline";
import { PodViewer } from "@/components/shared/pod-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/loaders/skeleton";
import { useShipment } from "@/features/shipment/hooks/use-shipments";
import { ROUTES } from "@/app/constants/routes";

export function CustomerShipmentDetailPage() {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const { data: shipment, isLoading, isError, refetch } = useShipment(shipmentId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !shipment) {
    return <ErrorState message="Couldn't load this shipment." onRetry={() => refetch()} />;
  }

  return (
    <div>
      <PageHeader
        title={shipment.reference}
        description="Track this shipment from booking to delivery."
        breadcrumbs={[{ label: "Shipments", href: ROUTES.customer.shipments }, { label: shipment.reference }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ShipmentSummaryCard shipment={shipment} />
          <PodViewer pod={shipment.proofOfDelivery} />
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ShipmentTimeline events={shipment?.timeline} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
