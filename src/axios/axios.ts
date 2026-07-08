import axios from "axios";
import { env } from "@/app/config/env";

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});
