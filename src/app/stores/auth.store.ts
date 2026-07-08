import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/app/types/domain";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setSession: (user: AuthUser, tokens: AuthTokens) => void;
  setAccessToken: (accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      setSession: (user, tokens) => set({ user, tokens, isAuthenticated: true }),

      setAccessToken: (accessToken) =>
        set((state) => ({
          tokens: state.tokens ? { ...state.tokens, accessToken } : null,
        })),

      clearSession: () => set({ user: null, tokens: null, isAuthenticated: false }),
    }),
    {
      name: "bowmenn-auth",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export function getAuthTokens(): AuthTokens | null {
  return useAuthStore.getState().tokens;
}
