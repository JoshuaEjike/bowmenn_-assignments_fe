import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { httpClient } from "./axios";
import { env } from "@/app/config/env";
import { getAuthTokens, useAuthStore } from "@/app/stores/auth.store";
import type { ApiError } from "@/app/types/domain";
import { QueryClient } from "@tanstack/react-query";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// A bare instance, deliberately not `httpClient`, so refreshing the token
// never recurses through this same interceptor chain.
const refreshClient = axios.create({ baseURL: env.apiBaseUrl });

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const tokens = getAuthTokens();
  if (!tokens?.refreshToken) {
    throw new Error("No refresh token available");
  }

  const { data } = await refreshClient.post<{ accessToken: string }>("/auth/refresh", {
    refreshToken: tokens.refreshToken,
  });

  useAuthStore.getState().setAccessToken(data.accessToken);
  return data.accessToken;
}

httpClient.interceptors.request.use((config) => {
  const tokens = getAuthTokens();
  if (tokens?.accessToken) {
    config.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; code?: string; fieldErrors?: Record<string, string> }>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const queryClient = new QueryClient();

    const isSessionError =
      status === 401 && (message?.includes("session has expired") || message?.includes("No access token"));

    // Attempt exactly one silent refresh-and-retry per request.
    if (isSessionError && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        refreshPromise ??= refreshAccessToken();
        const accessToken = await refreshPromise;
        refreshPromise = null;
        originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
        return httpClient(originalRequest);
      } catch {
        refreshPromise = null;
        useAuthStore.getState().clearSession();

        queryClient.clear();

        window.location.assign("/login");

        return Promise.reject(error);
      }
    }

    const normalized: ApiError = {
      message: error.response?.data?.message ?? error.message ?? "Something went wrong. Please try again.",
      code: error.response?.data?.code ?? "UNKNOWN_ERROR",
      status: status ?? 0,
      fieldErrors: error.response?.data?.fieldErrors,
    };

    return Promise.reject(normalized);
  },
);
