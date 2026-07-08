import { AuthUserRes } from "@/app/types/domain";
import { httpClient } from "./axios";
import type {
  AuthResponseData,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  VerifyOtpPayload,
} from "@/features/auth/types";

export const authApi = {
  login: (payload: LoginPayload) =>
    httpClient.post<LoginResponse>("/auth/login", payload).then((r) => r.data?.data),

  register: (payload: RegisterPayload) =>
    httpClient.post<AuthResponseData>("/auth/register", payload).then((r) => r.data?.data),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    httpClient.post<{ message: string }>("/auth/forgot-password", payload).then((r) => r.data),

  verifyOtp: (payload: VerifyOtpPayload) =>
    httpClient.post<{ verified: true }>("/auth/verify-otp", payload).then((r) => r.data),

  resetPassword: (payload: ResetPasswordPayload) =>
    httpClient.post<{ message: string }>("/auth/reset-password", payload).then((r) => r.data),

  updateProfile: (payload: UpdateProfilePayload) =>
    httpClient.patch<AuthUserRes>("/users/me", payload).then((r) => r.data?.data),
};
