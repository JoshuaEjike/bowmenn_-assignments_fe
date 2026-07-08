import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CreateShipmentFormValues } from "@/features/shipment/validation";

interface AddressFieldsetProps {
  title: string;
  prefix: "pickup" | "delivery";
  register: UseFormRegister<CreateShipmentFormValues>;
  errors: FieldErrors<CreateShipmentFormValues>;
}

export function AddressFieldset({ title, prefix, register, errors }: AddressFieldsetProps) {
  const fieldErrors = errors[prefix];

  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-4">
      <legend className="px-1 text-sm font-semibold text-foreground">{title}</legend>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor={`${prefix}.label`} required>
            Location label
          </Label>
          <Input
            id={`${prefix}.label`}
            placeholder="e.g. Apapa Warehouse"
            invalid={!!fieldErrors?.label}
            {...register(`${prefix}.label`)}
          />
          {fieldErrors?.label && <p className="text-xs text-danger">{fieldErrors.label.message}</p>}
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor={`${prefix}.line1`} required>
            Street address
          </Label>
          <Input id={`${prefix}.line1`} invalid={!!fieldErrors?.line1} {...register(`${prefix}.line1`)} />
          {fieldErrors?.line1 && <p className="text-xs text-danger">{fieldErrors.line1.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.city`} required>
            City
          </Label>
          <Input id={`${prefix}.city`} invalid={!!fieldErrors?.city} {...register(`${prefix}.city`)} />
          {fieldErrors?.city && <p className="text-xs text-danger">{fieldErrors.city.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.state`} required>
            State
          </Label>
          <Input id={`${prefix}.state`} invalid={!!fieldErrors?.state} {...register(`${prefix}.state`)} />
          {fieldErrors?.state && <p className="text-xs text-danger">{fieldErrors.state.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.postalCode`} required>
            Postal code
          </Label>
          <Input id={`${prefix}.postalCode`} invalid={!!fieldErrors?.postalCode} {...register(`${prefix}.postalCode`)} />
          {fieldErrors?.postalCode && <p className="text-xs text-danger">{fieldErrors.postalCode.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.country`} required>
            Country
          </Label>
          <Input id={`${prefix}.country`} invalid={!!fieldErrors?.country} {...register(`${prefix}.country`)} />
          {fieldErrors?.country && <p className="text-xs text-danger">{fieldErrors.country.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.contactName`} required>
            Contact name
          </Label>
          <Input id={`${prefix}.contactName`} invalid={!!fieldErrors?.contactName} {...register(`${prefix}.contactName`)} />
          {fieldErrors?.contactName && <p className="text-xs text-danger">{fieldErrors.contactName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.contactPhone`} required>
            Contact phone
          </Label>
          <Input id={`${prefix}.contactPhone`} invalid={!!fieldErrors?.contactPhone} {...register(`${prefix}.contactPhone`)} />
          {fieldErrors?.contactPhone && <p className="text-xs text-danger">{fieldErrors.contactPhone.message}</p>}
        </div>
      </div>
    </fieldset>
  );
}
