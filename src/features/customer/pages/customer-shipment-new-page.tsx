import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressFieldset } from "@/features/shipment/components/address-fieldset";
import { createShipmentSchema, type CreateShipmentFormValues } from "@/features/shipment/validation";
import { useCreateShipment } from "@/features/shipment/hooks/use-shipments";
import { TRUCK_TYPES } from "@/app/types/domain";
import { ROUTES } from "@/app/constants/routes";

const TRUCK_TYPE_LABELS: Record<(typeof TRUCK_TYPES)[number], string> = {
  flatbed: "Flatbed",
  box_truck: "Box truck",
  refrigerated: "Refrigerated",
  tanker: "Tanker",
  container: "Container",
  heavy_haul: "Heavy haul",
};

export function CustomerShipmentNewPage() {
  const navigate = useNavigate();
  const createShipment = useCreateShipment();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateShipmentFormValues>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      truckType: "box_truck",
      pickup: { country: "Nigeria" },
      delivery: { country: "Nigeria" },
    } as Partial<CreateShipmentFormValues>,
  });

  const onSubmit = (values: CreateShipmentFormValues) => {
    createShipment.mutate(values, {
      onSuccess: (shipment) => navigate(ROUTES.customer.shipmentDetail(shipment.id)),
    });
  };

  return (
    <div>
      <PageHeader
        title="Book a new shipment"
        description="Tell us what's moving and where — we'll estimate price and distance instantly."
        breadcrumbs={[{ label: "Shipments", href: ROUTES.customer.shipments }, { label: "New shipment" }]}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h3 className="text-sm font-semibold text-foreground">Cargo details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cargoDescription" required>
                  Cargo description
                </Label>
                <Textarea
                  id="cargoDescription"
                  placeholder="e.g. 200 cartons of packaged electronics"
                  invalid={!!errors.cargoDescription}
                  {...register("cargoDescription")}
                />
                {errors.cargoDescription && (
                  <p className="text-xs text-danger">{errors.cargoDescription.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cargoWeightKg" required>
                  Cargo weight (kg)
                </Label>
                <Input
                  id="cargoWeightKg"
                  type="number"
                  min={1}
                  invalid={!!errors.cargoWeightKg}
                  {...register("cargoWeightKg")}
                />
                {errors.cargoWeightKg && (
                  <p className="text-xs text-danger">{errors.cargoWeightKg.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="truckType" required>
                  Truck type
                </Label>
                <Controller
                  name="truckType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="truckType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TRUCK_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {TRUCK_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="requestedPickupDate" required>
                  Requested pickup date
                </Label>
                <Input
                  id="requestedPickupDate"
                  type="date"
                  invalid={!!errors.requestedPickupDate}
                  {...register("requestedPickupDate")}
                />
                {errors.requestedPickupDate && (
                  <p className="text-xs text-danger">{errors.requestedPickupDate.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <AddressFieldset title="Pickup address" prefix="pickup" register={register} errors={errors} />
        <AddressFieldset title="Delivery address" prefix="delivery" register={register} errors={errors} />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.customer.shipments)}>
            Cancel
          </Button>
          <Button type="submit" className="text-white" isLoading={createShipment.isPending}>
            <Truck /> Book shipment
          </Button>
        </div>
      </form>
    </div>
  );
}
