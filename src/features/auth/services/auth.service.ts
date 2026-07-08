import { env } from "@/app/config/env";
import { authApi } from "@/axios/auth.api";
import { authMockService } from "./auth.mock";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  VerifyOtpPayload,
} from "../types";

export const authService = {
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    env.useMockApi ? authMockService.login(payload) : authApi.login(payload),

  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    env.useMockApi ? authMockService.register(payload) : authApi.register(payload),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    env.useMockApi ? authMockService.forgotPassword(payload) : authApi.forgotPassword(payload),

  verifyOtp: (payload: VerifyOtpPayload) =>
    env.useMockApi ? authMockService.verifyOtp(payload) : authApi.verifyOtp(payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    env.useMockApi ? authMockService.resetPassword(payload) : authApi.resetPassword(payload),

  updateProfile: (userId: string, payload: UpdateProfilePayload) =>
    env.useMockApi ? authMockService.updateProfile(userId, payload) : authApi.updateProfile(payload),
};
