import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-muted-foreground border-border",
        primary: "bg-primary-50 text-primary-700 border-primary-200",
        accent: "bg-accent-50 text-accent-700 border-accent-200",
        success: "bg-success/10 text-success border-success/30",
        warning: "bg-warning/10 text-warning border-warning/30",
        danger: "bg-danger/10 text-danger border-danger/30",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
