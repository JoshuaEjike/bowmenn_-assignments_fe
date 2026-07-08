import { TRUCK_TYPES } from "@/app/types/domain";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    phone: z.string().min(7, "Enter a valid phone number"),
    role: z.enum(["customer", "driver"]),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code"),
});
export type OtpFormValues = z.infer<typeof otpSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z.object({
  // truckType: z.union([z.enum(TRUCK_TYPES), z.literal("")]).optional(),
  // vehiclePlate: z.string().optional(),
  // companyName: z.string().optional(),
  truckType: z.preprocess((value) => (value === "" ? undefined : value), z.enum(TRUCK_TYPES).optional()),

  vehiclePlate: z.preprocess((value) => (value === "" ? undefined : value), z.string().optional()),

  companyName: z.preprocess((value) => (value === "" ? undefined : value), z.string().optional()),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
});
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
