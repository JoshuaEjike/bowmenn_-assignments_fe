import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/app/constants/routes";
import { authService } from "../services/auth.service";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../validation";
import type { ApiError } from "@/app/types/domain";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const requestReset = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(`${ROUTES.verifyOtp}?email=${encodeURIComponent(getValues("email"))}`);
    },
    onError: (error: ApiError) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.login}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to login
      </Link>

      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold text-foreground">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a 6-digit reset code.
        </p>
      </div>

      <form onSubmit={handleSubmit((values) => requestReset.mutate(values))} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            leadingIcon={<Mail />}
            invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full text-white" isLoading={requestReset.isPending}>
          Send reset code
        </Button>
      </form>
    </div>
  );
}
