import { useState } from "react";
import { useParams } from "react-router-dom";
import { PackageCheck, ThumbsDown, ThumbsUp, Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ShipmentSummaryCard } from "@/components/cards/shipment-summary-card";
import { ShipmentTimeline } from "@/components/shared/shipment-timeline";
import { PodViewer } from "@/components/shared/pod-viewer";
import { FileUpload } from "@/components/forms/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/loaders/skeleton";
import { useShipment, useUpdateShipmentStatus, useUploadPod } from "@/features/shipment/hooks/use-shipments";
import { SHIPMENT_LIFECYCLE } from "@/app/constants/shipment-status";
import { ROUTES } from "@/app/constants/routes";
import type { ShipmentStatus } from "@/app/types/domain";

function nextStatus(current: ShipmentStatus): ShipmentStatus | null {
  const index = SHIPMENT_LIFECYCLE.indexOf(current);
  return index >= 0 && index < SHIPMENT_LIFECYCLE.length - 1 ? (SHIPMENT_LIFECYCLE[index + 1] ?? null) : null;
}

export function DriverShipmentDetailPage() {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const { data: shipment, isLoading, isError, refetch } = useShipment(shipmentId);
  const updateStatus = useUpdateShipmentStatus();
  const uploadPod = useUploadPod();

  const [podFile, setPodFile] = useState<File | null>(null);
  const [receivedBy, setReceivedBy] = useState("");

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

  const next = nextStatus(shipment.status);
  const isAwaitingResponse = shipment.status === "assigned";
  const isReadyForPod = shipment.status === "in_transit";

  return (
    <div>
      <PageHeader
        title={shipment.reference}
        description="Move this shipment forward and upload proof of delivery when it's done."
        breadcrumbs={[
          { label: "My shipments", href: ROUTES.driver.shipments },
          { label: shipment.reference },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ShipmentSummaryCard shipment={shipment} />

          {isAwaitingResponse && (
            <Card>
              <CardHeader>
                <CardTitle>Respond to this assignment</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button
                  variant="outline"
                  isLoading={updateStatus.isPending}
                  onClick={() =>
                    updateStatus.mutate({
                      shipmentId: shipment.id,
                      status: "cancelled",
                      note: "Rejected by driver",
                    })
                  }
                >
                  <ThumbsDown /> Reject
                </Button>
                <Button
                  isLoading={updateStatus.isPending}
                  className="text-white"
                  onClick={() => updateStatus.mutate({ shipmentId: shipment.id, status: "accepted" })}
                >
                  <ThumbsUp /> Accept assignment
                </Button>
              </CardContent>
            </Card>
          )}

          {!isAwaitingResponse && next && next !== "delivered" && (
            <Card>
              <CardHeader>
                <CardTitle>Move shipment forward</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  isLoading={updateStatus.isPending}
                  className="text-white"
                  onClick={() => updateStatus.mutate({ shipmentId: shipment.id, status: next })}
                >
                  <Truck /> Mark as {next.replace("_", " ")}
                </Button>
              </CardContent>
            </Card>
          )}

          {isReadyForPod && (
            <Card>
              <CardHeader>
                <CardTitle>Upload proof of delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUpload
                  selectedFile={podFile}
                  onFileSelect={setPodFile}
                  onClear={() => setPodFile(null)}
                  isUploading={uploadPod.isPending}
                />
                <div className="space-y-1.5">
                  <Label htmlFor="receivedBy" required>
                    Received by
                  </Label>
                  <Input
                    id="receivedBy"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    placeholder="Name of person who signed"
                  />
                </div>
                <Button
                  disabled={!podFile || !receivedBy}
                  isLoading={uploadPod.isPending}
                  className="text-white"
                  onClick={() => uploadPod.mutate({ shipmentId: shipment.id, file: podFile, receivedBy })}
                >
                  <PackageCheck /> Confirm delivery
                </Button>
              </CardContent>
            </Card>
          )}

          <PodViewer pod={shipment.proofOfDelivery} />
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ShipmentTimeline events={shipment.timeline} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
