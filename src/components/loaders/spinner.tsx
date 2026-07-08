import { Loader2 } from "lucide-react";
import { cn } from "@/app/lib/cn";

export function Spinner({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className="inline-flex items-center">
      <Loader2 className={cn("h-5 w-5 animate-spin text-primary-600", className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
