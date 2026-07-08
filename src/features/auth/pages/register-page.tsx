import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Phone, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/app/lib/cn";
import { ROUTES } from "@/app/constants/routes";
import { useRegister } from "../hooks/use-auth";
import { registerSchema, type RegisterFormValues } from "../validation";
import { useState } from "react";

export function RegisterPage() {
  const [visible, setVisible] = useState(false);

  const registerAccount = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "customer" },
  });

  const role = watch("role");
  const onSubmit = (values: RegisterFormValues) => registerAccount.mutate(values);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold text-foreground">Create your account</h1>
        <p className="text-sm text-muted-foreground">Book shipments or start driving for Bowmenn.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-md border border-border bg-muted p-1">
        {(["customer", "driver"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setValue("role", option, { shouldValidate: true })}
            className={cn(
              "rounded-sm py-1.5 text-sm font-medium capitalize transition-colors",
              role === option ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" required>
              First name
            </Label>
            <Input
              id="firstName"
              leadingIcon={<User />}
              invalid={!!errors.firstName}
              {...register("firstName")}
            />
            {errors.firstName && <p className="text-xs text-danger">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" required>
              Last name
            </Label>
            <Input id="lastName" invalid={!!errors.lastName} {...register("lastName")} />
            {errors.lastName && <p className="text-xs text-danger">{errors.lastName.message}</p>}
          </div>
        </div>

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

        <div className="space-y-1.5">
          <Label htmlFor="phone" required>
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            leadingIcon={<Phone />}
            invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone && <p className="text-xs text-danger">{errors.phone.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="password" required>
              Password
            </Label>
            <Input
              id="password"
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
              invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" required>
              Confirm
            </Label>
            <Input
              id="confirmPassword"
              type={visible ? "text" : "password"}
              invalid={!!errors.confirmPassword}
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
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full text-white" isLoading={registerAccount.isPending}>
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to={ROUTES.login} className="font-medium text-primary-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
