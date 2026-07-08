import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Wire this to an error-tracking service (Sentry, etc.) in production.
    console.error("Uncaught error in subtree:", error, info.componentStack);
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10">
              <AlertOctagon className="h-7 w-7 text-danger" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">Something broke on our end</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                The page hit an unexpected error. Reloading usually fixes it.
              </p>
            </div>
            <Button onClick={() => window.location.reload()}>Reload page</Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
