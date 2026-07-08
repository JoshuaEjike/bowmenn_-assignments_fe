import { Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/shared/profile-form";

export function DriverProfilePage() {
  return (
    <div>
      <PageHeader title="Your profile" description="Manage your account and vehicle details." />
      <ProfileForm
        extraDetails={
          <div className="flex w-full items-center gap-2 border-t border-border pt-4 text-left text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            Vehicle details are managed by dispatch — contact admin to update.
          </div>
        }
      />
    </div>
  );
}
