import React from "react";
import Image from "next/image";
import { GoldCurlDecoration } from "@/components/ui/GoldCurlDecoration";
import { LoginForm } from "@/components/login/LoginForm";

interface RightPanelProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function RightPanel({
  title = "BNI Privilege Card",
  subtitle = "Trivandrum Region · Member Login",
  children,
}: RightPanelProps) {
  return (
    <div className="relative flex items-center justify-center min-h-screen lg:min-h-full px-6 py-12 lg:px-12 overflow-hidden">

      {/* Layer 1 — Background image */}
      <Image
        src="/images/background.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
        aria-hidden="true"
      />

      {/* Layer 2 — Radial gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        // style={{
        //   background:
        //     "radial-gradient(ellipse at 40% 30%, rgba(195,21,38,0.85) 0%, rgba(180,14,41,0.9) 40%, rgba(37,31,32,0.95) 100%)",
        // }}
        aria-hidden="true"
      />

      {/* Layer 3 — Gold curl decoration bottom-right */}
      <GoldCurlDecoration />

      {/* Layer 4 — Card */}
      <div
        className="relative z-[10] w-full max-w-[420px] rounded-2xl px-8 py-10 border border-white/15"
        style={{
          background: "rgba(217, 217, 217, 0.05)",
          boxShadow: "0 4px 4px rgba(0,0,0,0.25), 0 4px 4px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header — logo + titles */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/Union.png"
            alt="BNI Trivandrum"
            width={100}
            height={48}
            priority
            className="object-contain"
          />
   
          <h2 className="text-[20px] font-bold !text-white mt-4 text-center">
            {title}
          </h2>
          <p className="!text-[13px] !text-white/65 !mt-4 text-center">
            {subtitle}
          </p>
        </div>

        {/* Form content — LoginForm by default, or any child */}
        {children ?? <LoginForm />}
      </div>
    </div>
  );
}