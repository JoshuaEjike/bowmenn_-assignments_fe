import { Spinner } from "@/components/loaders/spinner";

export function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner label="Loading page" className="h-6 w-6" />
    </div>
  );
}
