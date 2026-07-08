import { mockDelay, nextId } from "@/app/lib/mock-api";
import type { AuthUser } from "@/app/types/domain";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  VerifyOtpPayload,
} from "../types";

const MOCK_PASSWORD = "Password1";

const mockUsers: AuthUser[] = [
  {
    id: "user_admin_1",
    firstName: "Amaka",
    lastName: "Obi",
    email: "admin@bowmenn.com",
    phone: "+2348012345678",
    role: "admin",
    createdAt: "2024-01-10T09:00:00.000Z",
  },
  {
    id: "user_driver_1",
    firstName: "Tunde",
    lastName: "Bello",
    email: "driver@bowmenn.com",
    phone: "+2348023456789",
    role: "driver",
    createdAt: "2024-02-14T09:00:00.000Z",
  },
  {
    id: "user_customer_1",
    firstName: "Ifeoma",
    lastName: "Chukwu",
    email: "customer@bowmenn.com",
    phone: "+2348034567890",
    role: "customer",
    createdAt: "2024-03-20T09:00:00.000Z",
  },
];

function issueTokens(user: AuthUser): AuthResponse {
  return {
    user,
    accessToken: `mock-access-${user.id}-${Date.now()}`,
    refreshToken: `mock-refresh-${user.id}-${Date.now()}`,
  };
}

export const authMockService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    await mockDelay();
    const user = mockUsers.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (!user || payload.password !== MOCK_PASSWORD) {
      throw { message: "Incorrect email or password.", code: "INVALID_CREDENTIALS", status: 401 };
    }
    return issueTokens(user);
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await mockDelay();
    if (mockUsers.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      throw {
        message: "An account with this email already exists.",
        code: "EMAIL_TAKEN",
        status: 409,
        fieldErrors: { email: "This email is already registered." },
      };
    }
    const user: AuthUser = {
      id: nextId("user"),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(user);
    return issueTokens(user);
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    await mockDelay();
    const exists = mockUsers.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (!exists) {
      throw { message: "No account found with this email.", code: "NOT_FOUND", status: 404 };
    }
    return { message: "A 6-digit code has been sent to your email." };
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<{ verified: true }> {
    await mockDelay(400);
    if (payload.otp !== "123456") {
      throw {
        message: "That code is incorrect or expired.",
        code: "INVALID_OTP",
        status: 400,
        fieldErrors: { otp: "Incorrect code" },
      };
    }
    return { verified: true };
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    await mockDelay();
    if (payload.otp !== "123456") {
      throw { message: "That code is incorrect or expired.", code: "INVALID_OTP", status: 400 };
    }
    return { message: "Your password has been reset. You can now log in." };
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    await mockDelay(150);
    return { accessToken: `mock-access-refreshed-${refreshToken.slice(-6)}-${Date.now()}` };
  },

  async updateProfile(userId: string, payload: UpdateProfilePayload): Promise<AuthUser> {
    await mockDelay(400);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      throw { message: "User not found.", code: "NOT_FOUND", status: 404 };
    }
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.phone = payload.phone;
    if (payload.avatarUrl) user.avatarUrl = payload.avatarUrl;
    return user;
  },
};
