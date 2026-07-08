import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/app/constants/routes";

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10">
        <ShieldAlert className="h-7 w-7 text-danger" aria-hidden />
      </div>
      <p className="font-display text-5xl font-semibold text-foreground">403</p>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-foreground">You don't have access to this page</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your account role doesn't include permission to view this area of Bowmenn.
        </p>
      </div>
      <Button asChild>
        <Link to={ROUTES.root} className="text-white">
          Back to dashboard
        </Link>
      </Button>
    </div>
  );
}
