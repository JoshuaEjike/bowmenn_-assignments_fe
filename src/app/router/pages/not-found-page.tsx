import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/app/constants/routes";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Compass className="h-7 w-7 text-muted-foreground" aria-hidden />
      </div>
      <p className="font-display text-5xl font-semibold text-foreground">404</p>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-foreground">This route doesn't exist</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you're looking for was moved, renamed, or never shipped.
        </p>
      </div>
      <Button asChild>
        <Link to={ROUTES.root} className="text-white">
          Back to safety
        </Link>
      </Button>
    </div>
  );
}
