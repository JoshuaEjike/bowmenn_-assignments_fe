import type { LucideIcon } from "lucide-react";
import { cn } from "@/app/lib/cn";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down" | "flat" };
  accent?: "primary" | "accent" | "success" | "warning" | "danger";
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-primary-50 text-primary-700",
  accent: "bg-accent-50 text-accent-700",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

const trendClasses = { up: "text-success", down: "text-danger", flat: "text-muted-foreground" };

export function StatCard({ label, value, icon: Icon, trend, accent = "primary" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {trend && (
            <p className={cn("text-xs font-medium", trendClasses[trend.direction])}>
              {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"} {trend.value}
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", accentClasses[accent])}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}
