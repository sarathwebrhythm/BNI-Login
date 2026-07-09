"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { forgotPassword, verifyOtp, resetPassword } from "@/lib/api";

type Step = "email" | "otp" | "reset";

export function ForgotPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // OTP timer
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start timer when OTP step begins
  useEffect(() => {
    if (step === "otp") {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1 — Send OTP
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setStep("otp");
      } else {
        setApiError(res.message??"An error occurred. Please try again.");
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 — Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setApiError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyOtp(email, otpValue);
      if (res.success) {
        setStep("reset");
      } else {
        setApiError(res.message??"An error occurred. Please try again.");
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setApiError("");
    setOtp(["", "", "", "", "", ""]);
    setIsLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setApiSuccess("OTP resent successfully!");
        setTimeout(() => setApiSuccess(""), 3000);
        startTimer();
      } else {
        setApiError(res.message??"An error occurred. Please try again.");
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 — Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setPasswordError("");

    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(email, password, confirmPassword);
      if (res.success) {
        setApiSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setApiError(res.message??"An error occurred. Please try again.");
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex flex-col gap-5 w-full">

      {/* API error */}
      {apiError && (
        <div className="w-full px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/50 text-white text-sm text-center">
          {apiError}
        </div>
      )}

      {/* API success */}
      {apiSuccess && (
        <div className="w-full px-4 py-3 rounded-xl bg-green-500/20 border border-green-400/50 text-white text-sm text-center">
          {apiSuccess}
        </div>
      )}

      {/* ===== STEP 1 — EMAIL ===== */}
      {step === "email" && (
        <form onSubmit={handleEmailSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-white">
              Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 pointer-events-none">
                <Image src="/images/Vector-5.png" alt="" width={22} height={22} className="object-contain opacity-60" />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); setApiError(""); }}
                placeholder="your@email.com"
                autoComplete="email"
                className={`
                  w-full h-[52px] pl-11 pr-4
                  bg-white/10 border rounded-xl
                  text-white placeholder:text-white/35
                  text-sm font-medium
                  outline-none focus:bg-white/14
                  transition-all duration-200
                  ${emailError ? "border-red-400/70 focus:border-red-400" : "border-white/22 focus:border-white/55"}
                `}
              />
            </div>
            {emailError && (
              <p className="!text-12 !text-red-300 !leading-tight pl-1">{emailError}</p>
            )}
          </div>

          <SubmitButton isLoading={isLoading} label="Send OTP" />

          <p className="!text-center !text-sm !text-white/65 mt-1">
            Remember your password?{" "}
            <a href="/" className="!text-accent font-semibold hover:text-accent-light transition-colors">
              Sign in
            </a>
          </p>
        </form>
      )}

      {/* ===== STEP 2 — OTP ===== */}
      {step === "otp" && (
        <form onSubmit={handleOtpSubmit} noValidate className="flex flex-col gap-5">
          <p className="!text-sm !text-white/70 text-center">
            OTP sent to <span className="text-white font-semibold">{email}</span>
          </p>

          {/* OTP boxes */}
          <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="
                  w-11 h-12 text-center
                  bg-white/10 border border-white/22 rounded-xl
                  text-white text-lg font-bold
                  outline-none focus:border-white/55 focus:bg-white/14
                  transition-all duration-200
                "
              />
            ))}
          </div>

          {/* Timer / Resend */}
          <div className="flex justify-center">
            {!canResend ? (
              <p className="!text-sm !text-white/60">
                Resend OTP in{" "}
                <span className="text-accent font-semibold">
                  00:{timer.toString().padStart(2, "0")}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="text-sm font-semibold text-accent hover:text-accent-light transition-colors disabled:opacity-50"
              >
                Resend OTP
              </button>
            )}
          </div>

          <SubmitButton isLoading={isLoading} label="Verify OTP" />

          <button
            type="button"
            onClick={() => { setStep("email"); setApiError(""); setOtp(["","","","","",""]); }}
            className="!text-sm !text-white/60 hover:!text-white/80 text-center transition-colors"
          >
            ← Change email
          </button>
        </form>
      )}

      {/* ===== STEP 3 — RESET PASSWORD ===== */}
      {step === "reset" && (
        <form onSubmit={handleResetSubmit} noValidate className="flex flex-col gap-5">
          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-white">
              New Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 pointer-events-none">
                <Image src="/images/Vector-6.png" alt="" width={12} height={18} className="object-contain opacity-60" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(""); setApiError(""); }}
                placeholder="Min. 6 characters"
                className={`
                  w-full h-[52px] pl-11 pr-12
                  bg-white/10 border rounded-xl
                  text-white placeholder:text-white/35
                  text-sm font-medium
                  outline-none focus:bg-white/14
                  transition-all duration-200
                  ${passwordError ? "border-red-400/70" : "border-white/22 focus:border-white/55"}
                `}
              />
              <button type="button" onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 opacity-50 hover:opacity-80 transition-opacity focus:outline-none rounded p-1">
                <Image src="/images/Vector-8.png" alt="" width={18} height={18} className="object-contain" />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-white">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 pointer-events-none">
                <Image src="/images/Vector-6.png" alt="" width={12} height={18} className="object-contain opacity-60" />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); setApiError(""); }}
                placeholder="Repeat your password"
                className={`
                  w-full h-[52px] pl-11 pr-12
                  bg-white/10 border rounded-xl
                  text-white placeholder:text-white/35
                  text-sm font-medium
                  outline-none focus:bg-white/14
                  transition-all duration-200
                  ${passwordError ? "border-red-400/70" : "border-white/22 focus:border-white/55"}
                `}
              />
              <button type="button" onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-4 opacity-50 hover:opacity-80 transition-opacity focus:outline-none rounded p-1">
                <Image src="/images/Vector-8.png" alt="" width={18} height={18} className="object-contain" />
              </button>
            </div>
            {passwordError && (
              <p className="!text-12 !text-red-300 !leading-tight pl-1">{passwordError}</p>
            )}
          </div>

          <SubmitButton isLoading={isLoading} label="Reset Password" />
        </form>
      )}
    </div>
  );
}

// Reusable submit button
function SubmitButton({ isLoading, label }: { isLoading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="
        relative w-full h-[52px]
        rounded-xl overflow-hidden
        flex items-center justify-center gap-3
        text-white font-semibold text-base
        border border-white/15
        transition-all duration-300
        hover:scale-[1.015] hover:border-white/25
        active:scale-[0.98]
        disabled:opacity-70 disabled:cursor-not-allowed
        focus:outline-none
        group
      "
      style={{
        background: "linear-gradient(180deg, #E31E3B 0%, #C31526 55%, #A50F20 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.25)",
      }}
    >
      {/* Bulb glow */}
      <div
        className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 40%, transparent 75%)" }}
        aria-hidden="true"
      />
      {/* Top shine */}
      <div
        className="absolute top-0 left-4 right-4 h-px opacity-60 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)" }}
        aria-hidden="true"
      />
      {isLoading ? (
        <span className="relative z-10 flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.3" />
            <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Please wait...
        </span>
      ) : (
        <span className="relative z-10">{label}</span>
      )}
    </button>
  );
}