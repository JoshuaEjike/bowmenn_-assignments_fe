export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
  useMockApi: (import.meta.env.VITE_USE_MOCK_API ?? "true") === "true",
  appName: "Bowmenn",
  appEnv: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
