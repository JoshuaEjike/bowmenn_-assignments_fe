import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/app/stores/auth.store";
import { useUpdateProfile } from "@/features/auth/hooks/use-auth";
import { updateProfileSchema, type UpdateProfileFormValues } from "@/features/auth/validation";
import { getInitials } from "@/app/utils/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TRUCK_TYPES } from "@/app/types/domain";

const TRUCK_TYPE_LABELS: Record<(typeof TRUCK_TYPES)[number], string> = {
  flatbed: "Flatbed",
  box_truck: "Box truck",
  refrigerated: "Refrigerated",
  tanker: "Tanker",
  container: "Container",
  heavy_haul: "Heavy haul",
};

interface ProfileFormProps {
  extraDetails?: ReactNode;
}

export function ProfileForm({ extraDetails }: ProfileFormProps) {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      truckType: user?.truckType ?? undefined,
      vehiclePlate: user?.vehiclePlate ?? undefined,
      companyName: user?.companyName ?? undefined,
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ?? "",
    },
  });

  if (!user) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="h-fit lg:col-span-1">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-xl">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-display text-lg font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm capitalize text-muted-foreground">{user.role}</p>
          </div>
          <div className="w-full space-y-2 border-t border-border pt-4 text-left text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" /> {user.phone}
            </p>
          </div>
          {extraDetails}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((values) => updateProfile.mutate(values))}
            noValidate
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" required>
                  First name
                </Label>
                <Input
                  id="firstName"
                  leadingIcon={<User />}
                  invalid={!!errors.firstName}
                  {...register("firstName")}
                />
                {errors.firstName && <p className="text-xs text-danger">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" required>
                  Last name
                </Label>
                <Input id="lastName" invalid={!!errors.lastName} {...register("lastName")} />
                {errors.lastName && <p className="text-xs text-danger">{errors.lastName.message}</p>}
              </div>
            </div>

            {user?.role?.toLowerCase() === "customer" && (
              <div className="space-y-1.5">
                <Label htmlFor="companyName" required>
                  Company Name
                </Label>
                <Input id="companyName" invalid={!!errors.companyName} {...register("companyName")} />
                {errors.companyName && <p className="text-xs text-danger">{errors.companyName.message}</p>}
              </div>
            )}

            {user?.role?.toLowerCase() === "driver" && (
              <div className="grid gap-4 sm:grid-cols-2">
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

                <div className="space-y-1.5">
                  <Label htmlFor="vehiclePlate" required>
                    Vehicle Plate
                  </Label>
                  <Input id="vehiclePlate" invalid={!!errors.vehiclePlate} {...register("vehiclePlate")} />
                  {errors.vehiclePlate && (
                    <p className="text-xs text-danger">{errors.vehiclePlate.message}</p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="phone" required>
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                leadingIcon={<Phone />}
                invalid={!!errors.phone}
                {...register("phone")}
              />
              {errors.phone && <p className="text-xs text-danger">{errors.phone.message}</p>}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="text-white"
                isLoading={updateProfile.isPending}
                disabled={!isDirty}
              >
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
