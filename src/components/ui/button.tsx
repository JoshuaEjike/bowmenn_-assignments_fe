import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/app/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary-800 text-primary-foreground hover:bg-primary-700 shadow-soft",
        accent: "bg-accent-500 text-accent-foreground hover:bg-accent-600 shadow-soft",
        outline: "border border-border bg-surface hover:bg-muted text-foreground",
        ghost: "hover:bg-muted text-foreground",
        destructive: "bg-danger text-danger-foreground hover:bg-danger/90",
        link: "text-primary-700 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

// export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, isLoading = false, disabled, children, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button";
//     return (
//       <Comp
//         ref={ref}
//         className={cn(buttonVariants({ variant, size }), className)}
//         disabled={disabled || isLoading}
//         aria-busy={isLoading || undefined}
//         {...props}
//       >
//         {isLoading && <Loader2 className="animate-spin" aria-hidden />}
//         {children}
//       </Comp>
//     );
//   },
// );

// export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, isLoading = false, disabled, children, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button";

//     return (
//       <Comp
//         ref={ref}
//         className={cn(buttonVariants({ variant, size }), className)}
//         aria-busy={isLoading || undefined}
//         {...(!asChild && {
//           disabled: disabled || isLoading,
//         })}
//         {...props}
//       >
//         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

//         {children}
//       </Comp>
//     );
//   },
// );

// export const Button = React.forwardRef<React.ElementRef<"button">, ButtonProps>(
//   ({ className, variant, size, asChild = false, isLoading = false, disabled, children, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button";

//     return (
//       <Comp
//         ref={ref}
//         className={cn(buttonVariants({ variant, size }), className)}
//         aria-busy={isLoading}
//         disabled={!asChild ? disabled || isLoading : undefined}
//         {...props}
//       >
//         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//         {children}
//       </Comp>
//     );
//   },
// );

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
