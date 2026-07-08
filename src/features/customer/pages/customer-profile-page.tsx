import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/shared/profile-form";

export function CustomerProfilePage() {
  return (
    <div>
      <PageHeader title="Your profile" description="Manage your account details." />
      <ProfileForm />
    </div>
  );
}
