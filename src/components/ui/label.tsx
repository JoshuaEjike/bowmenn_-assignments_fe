import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/app/lib/cn";

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  >
    {children}
    {required && <span className="ml-0.5 text-danger">*</span>}
  </LabelPrimitive.Root>
));
Label.displayName = "Label";
