import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/app/constants/routes";
import { authService } from "../services/auth.service";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../validation";
import type { ApiError } from "@/app/types/domain";

export function ResetPasswordPage() {
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const otp = useMemo(() => searchParams.get("otp") ?? "", [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const resetPassword = useMutation({
    mutationFn: (values: ResetPasswordFormValues) =>
      authService.resetPassword({ email, otp, newPassword: values.newPassword }),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(ROUTES.login);
    },
    onError: (error: ApiError) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold text-foreground">Set a new password</h1>
        <p className="text-sm text-muted-foreground">Choose a strong password you haven't used before.</p>
      </div>

      <form
        onSubmit={handleSubmit((values) => resetPassword.mutate(values))}
        noValidate
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="newPassword" required>
            New password
          </Label>
          <Input
            id="newPassword"
            type={visible ? "text" : "password"}
            leadingIcon={<Lock />}
            trailingIcon={
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="shrink-0 text-ink-400 transition hover:text-mint-400"
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            invalid={!!errors.newPassword}
            {...register("newPassword")}
          />
          {errors.newPassword && <p className="text-xs text-danger">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" required>
            Confirm new password
          </Label>
          <Input
            id="confirmPassword"
            type={visible ? "text" : "password"}
            leadingIcon={<Lock />}
            trailingIcon={
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="shrink-0 text-ink-400 transition hover:text-mint-400"
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="text-xs text-danger">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full text-white" isLoading={resetPassword.isPending}>
          Reset password
        </Button>
      </form>
    </div>
  );
}
