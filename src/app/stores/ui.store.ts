import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface UIState {
  theme: Theme;
  isSidebarCollapsed: boolean;
  isMobileNavOpen: boolean;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      theme: "system",
      isSidebarCollapsed: false,
      isMobileNavOpen: false,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setMobileNavOpen: (isMobileNavOpen) => set({ isMobileNavOpen }),
    }),
    { name: "bowmenn-ui", partialize: (state) => ({ theme: state.theme, isSidebarCollapsed: state.isSidebarCollapsed }) },
  ),
);
