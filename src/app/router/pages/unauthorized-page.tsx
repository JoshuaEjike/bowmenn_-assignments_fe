import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/app/constants/routes";

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <LockKeyhole className="h-7 w-7 text-muted-foreground" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-foreground">Sign in to continue</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your session has ended or you're not signed in yet.
        </p>
      </div>
      <Button asChild>
        <Link to={ROUTES.login} className="text-white">
          Go to login
        </Link>
      </Button>
    </div>
  );
}
