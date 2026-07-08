import { useEffect, type PropsWithChildren } from "react";
import { useUIStore } from "@/app/stores/ui.store";

export function AppThemeProvider({ children }: PropsWithChildren) {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const isDark = theme === "dark" || (theme === "system" && media.matches);
      root.classList.toggle("dark", isDark);
    };

    apply();
    if (theme === "system") {
      media.addEventListener("change", apply);
      return () => media.removeEventListener("change", apply);
    }
  }, [theme]);

  return <>{children}</>;
}
