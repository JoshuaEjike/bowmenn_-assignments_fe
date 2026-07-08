import { QueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/app/stores/auth.store";
import { ROUTES } from "@/app/constants/routes";
import { authService } from "../services/auth.service";
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from "../types";
import type { UserRole } from "@/app/types/domain";
import type { ApiError } from "@/app/types/domain";

function roleHome(role: UserRole): string {
  switch (role) {
    case "admin":
      return ROUTES.admin.dashboard;
    case "driver":
      return ROUTES.driver.dashboard;
    case "customer":
      return ROUTES.customer.dashboard;
  }
}

export function useLogin() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setSession(data?.user, { accessToken: data?.accessToken, refreshToken: data?.refreshToken });

      toast.success(`Welcome back, ${data?.user?.firstName}`);

      navigate(roleHome(data?.user?.role), { replace: true });
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      setSession(data.user, { accessToken: data.accessToken, refreshToken: data.refreshToken });
      toast.success("Account created");
      navigate(roleHome(data.user.role), { replace: true });
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);

  const queryClient = new QueryClient();

  return () => {
    clearSession();
    queryClient.clear();
    toast.success("Signed out");
    navigate(ROUTES.login, { replace: true });
  };
}

export function useUpdateProfile() {
  const user = useAuthStore((state) => state.user);
  const tokens = useAuthStore((state) => state.tokens);
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => {
      if (!user) throw new Error("Not authenticated");

      return authService.updateProfile(user.id, payload);
    },
    onSuccess: (updatedUser) => {
      if (tokens) setSession(updatedUser, tokens);
      toast.success("Profile updated");
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}
