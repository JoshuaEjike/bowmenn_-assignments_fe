import { useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/app/constants/routes";
import { authService } from "../services/auth.service";
import { otpSchema, type OtpFormValues } from "../validation";
import type { ApiError } from "@/app/types/domain";

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const { control, handleSubmit, setValue, watch } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otp = watch("otp");
  const digits = otp.padEnd(6, " ").split("").slice(0, 6);

  const verify = useMutation({
    mutationFn: () => authService.verifyOtp({ email, otp }),
    onSuccess: () => {
      toast.success("Code verified");
      navigate(`${ROUTES.resetPassword}?email=${encodeURIComponent(email)}&otp=${otp}`);
    },
    onError: (error: ApiError) => toast.error(error.message),
  });

  function handleDigitChange(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = digits.slice();
    next[index] = char || " ";
    const joined = next.join("").trimEnd();
    setValue("otp", joined);
    if (char && index < 5) inputsRef.current[index + 1]?.focus();
  }

  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.forgotPassword}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold text-foreground">Enter verification code</h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email || "your email"}</span>. Use{" "}
          <span className="font-mono">123456</span> in this demo.
        </p>
      </div>

      <form onSubmit={handleSubmit(() => verify.mutate())} className="space-y-4">
        <Controller
          control={control}
          name="otp"
          render={() => (
            <div className="flex gap-2">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  value={digit.trim()}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-12 w-11 rounded-md border border-input bg-surface text-center text-lg font-semibold text-foreground shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
          )}
        />

        <Button
          type="submit"
          className="w-full text-white"
          isLoading={verify.isPending}
          disabled={otp.length !== 6}
        >
          Verify code
        </Button>
      </form>
    </div>
  );
}
