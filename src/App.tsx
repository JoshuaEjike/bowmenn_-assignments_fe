import { Toaster } from "sonner";
import { AppQueryProvider } from "@/app/providers/query-provider";
import { AppThemeProvider } from "@/app/providers/theme-provider";
import { ErrorBoundary } from "@/app/providers/error-boundary";
import { AppRouter } from "@/app/router/router";

export function App() {
  return (
    <ErrorBoundary>
      <AppQueryProvider>
        <AppThemeProvider>
          <AppRouter />
          <Toaster position="top-right" richColors closeButton />
        </AppThemeProvider>
      </AppQueryProvider>
    </ErrorBoundary>
  );
}
