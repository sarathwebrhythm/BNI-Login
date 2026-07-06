"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginMember } from "@/lib/api";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [apiError, setApiError] = useState<string>("");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setApiError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await loginMember(
        formData.email,
        formData.password,
        "inhouse",
      );

      if (res.success && res.token && res.member) {
        const base = process.env.NEXT_PUBLIC_STORAGE_URL || "";
        const toUrl = (path?: string) =>
          path
            ? path.startsWith("http")
              ? path
              : `${base}${path}`
            : undefined;

        // Convert raw paths to full URLs before saving
        const member = {
          ...res.member,
          profile_photo: toUrl(res.member.profile_photo),
          cover_photo: toUrl(res.member.cover_photo),
          business_logo: toUrl(res.member.business_logo),
        };

        localStorage.setItem("member_token", res.token);
        localStorage.setItem("member", JSON.stringify(member));
        toast.success("Successfully logged in!");

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        toast.error(res.message || "Login failed. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (field in errors) {
      setErrors((p) => ({ ...p, [field]: undefined }));
    }
    // setApiError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 w-full"
    >
      {/* API error */}
      {/* {apiError && (
        <div className="w-full px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/50 text-white text-[13px] text-center">
          {apiError}
        </div>
      )} */}

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-white">
          Email
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 pointer-events-none">
            <Image
              src="/images/Vector-5.png"
              alt=""
              width={22}
              height={22}
              className="object-contain opacity-60"
            />
          </span>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            className={`
              w-full h-[52px] pl-11 pr-4
              bg-white/10 border rounded-xl
              text-white placeholder:text-white/35
              text-[13px] font-medium
               tracking-[0.22em]
              outline-none
              focus:bg-white/14
              transition-all duration-200
              ${
                errors.email
                  ? "border-red-400/70 focus:border-red-400"
                  : "border-white/22 focus:border-white/55"
              }
            `}
          />
        </div>
        {errors.email && (
          <p className="!text-[12px] !text-red-300 !leading-tight pl-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-semibold text-white">
          Password
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 pointer-events-none">
            <Image
              src="/images/Vector-6.png"
              alt=""
              width={12}
              height={18}
              className="object-contain opacity-60"
            />
          </span>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            className={`
              w-full h-[52px] pl-11 pr-12
              bg-white/10 border rounded-xl
              text-white placeholder:text-white/35
              text-[13px] font-medium tracking-[0.22em]
              outline-none
              focus:bg-white/14
              transition-all duration-200
              ${
                errors.password
                  ? "border-red-400/70 focus:border-red-400"
                  : "border-white/22 focus:border-white/55"
              }
            `}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 opacity-50 hover:opacity-80 transition-opacity duration-150 focus:outline-none rounded p-1"
          >
            <Image
              src={showPassword ? "/images/eye-off.png" : "/images/eye.png"}
              alt={showPassword ? "Hide password" : "Show password"}
              width={18}
              height={18}
              className="object-contain"
            />
          </button>
        </div>
        {errors.password && (
          <p className="!text-[12px] !text-red-300 !leading-tight pl-1">
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember me + Forgot */}
      <div className="flex items-center justify-between">
        <label
          className="flex items-center gap-2.5 cursor-pointer group"
          htmlFor="rememberMe"
        >
          <div className="relative w-4 h-4 flex-shrink-0">
            <input
              type="checkbox"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => handleChange("rememberMe", e.target.checked)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
            <div
              className={`
                w-4 h-4 rounded-[3px] border transition-all duration-150
                ${
                  formData.rememberMe
                    ? "bg-primary border-primary"
                    : "bg-white/10 border-white/40"
                }
              `}
            />
            {formData.rememberMe && (
              <svg
                className="absolute inset-0 w-4 h-4 pointer-events-none"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8l3.5 3.5L13 5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-[13px] text-white/65 group-hover:text-white/85 transition-colors">
            Remember me
          </span>
        </label>

        <a
          href="/forgot-password"
          className="text-[13px] font-semibold !text-white hover:opacity-80 transition-opacity duration-150 focus:outline-none focus-visible:underline"
        >
          Forget Password ?
        </a>
      </div>

      {/* Sign in button */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          relative w-full h-[52px]
          rounded-xl overflow-hidden
          flex items-center justify-center gap-3
          text-white font-semibold text-[15px]
          border border-white/15
          transition-all duration-300
          hover:scale-[1.015]
          hover:border-white/25
          active:scale-[0.98]
          disabled:opacity-70 disabled:cursor-not-allowed
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
          group
        "
        style={{
          background: "linear-gradient(180deg, #C31526 0%, #A50F20 100%)",
          boxShadow:
            "0 0 8px rgba(195,21,38,0.35), 0 0 20px rgba(195,21,38,0.45), 0 0 35px rgba(195,21,38,0.2)",
        }}
      >
        {isLoading ? (
          <span className="relative z-10 flex items-center gap-2">
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="3"
                opacity="0.3"
              />
              <path
                d="M12 2a10 10 0 0110 10"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            Signing in...
          </span>
        ) : (
          <span className="relative z-10 flex items-center gap-3">
            <Image
              src="/images/Vector-7.png"
              alt=""
              width={20}
              height={20}
              className="object-contain transition-transform duration-300 group-hover:translate-x-0.5"
            />
            Sign in to Privilege Card
          </span>
        )}
      </button>

      {/* Enquire */}
      <p className="!text-center !text-[13px] !text-white/65 mt-1">
        Not a BNI Trivandrum member yet?{" "}
        <a
          href="#"
          className="!text-accent font-semibold hover:text-accent-light transition-colors duration-150 focus:outline-none focus-visible:underline"
        >
          Enquire to join
        </a>
      </p>
    </form>
  );
}
