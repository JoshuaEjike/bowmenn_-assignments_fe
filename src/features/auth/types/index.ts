import type { AuthUser, TruckType } from "@/app/types/domain";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "customer" | "driver";
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseData {
  data: AuthResponse;
  message: string;
  success: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthResponse;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string;
  truckType?: TruckType;
  vehiclePlate?: string;
  companyName?: string;
}
