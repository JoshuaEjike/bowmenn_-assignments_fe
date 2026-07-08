import * as React from "react";
import { cn } from "@/app/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, leadingIcon, trailingIcon, ...props }, ref) => {
    if (leadingIcon || trailingIcon) {
      return (
        <div className="relative flex items-center">
          {leadingIcon && (
            <span className="pointer-events-none absolute left-3 flex h-4 w-4 items-center justify-center text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
              leadingIcon && "pl-9",
              trailingIcon && "pr-9",
              invalid && "border-danger focus-visible:ring-danger",
              className,
            )}
            aria-invalid={invalid || undefined}
            {...props}
          />
          {trailingIcon && (
            <span className="absolute right-3 flex h-4 w-4 items-center justify-center text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
              {trailingIcon}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          invalid && "border-danger focus-visible:ring-danger",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
