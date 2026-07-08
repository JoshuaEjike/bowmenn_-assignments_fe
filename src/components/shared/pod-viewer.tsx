import { FileCheck } from "lucide-react";
import type { ProofOfDelivery } from "@/app/types/domain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty/empty-state";
import { formatDateTime } from "@/app/utils/format";

export function PodViewer({ pod }: { pod?: ProofOfDelivery }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proof of delivery</CardTitle>
      </CardHeader>
      <CardContent>
        {!pod ? (
          <EmptyState
            icon={FileCheck}
            title="No proof of delivery yet"
            description="This will appear once the driver marks the shipment as delivered and uploads a POD."
            className="py-8"
          />
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-md bg-muted sm:w-32">
              {pod.imageUrl ? (
                <img src={pod.imageUrl} alt="Proof of delivery" className="h-full w-full rounded-md object-cover" />
              ) : (
                <FileCheck className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Received by</span>{" "}
                <span className="font-medium text-foreground">{pod.receivedBy}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Signed at</span>{" "}
                <span className="font-medium text-foreground">{formatDateTime(pod.signedAt)}</span>
              </p>
              {pod.notes && <p className="text-muted-foreground">{pod.notes}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
