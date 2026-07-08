import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/app/constants/routes";
import { useLogin } from "../hooks/use-auth";
import { loginSchema, type LoginFormValues } from "../validation";
import { useState } from "react";

export function LoginPage() {
  const [visible, setVisible] = useState(false);

  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => login.mutate(values);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to manage your shipments.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            leadingIcon={<Mail />}
            invalid={!!errors.email}
            placeholder="you@company.com"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" required>
              Password
            </Label>
            <Link to={ROUTES.forgotPassword} className="text-xs font-medium text-primary-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
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
            invalid={!!errors.password}
            placeholder="••••••••"
            {...register("password")}
          />

          {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full text-white" isLoading={login.isPending}>
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to={ROUTES.register} className="font-medium text-primary-700 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
