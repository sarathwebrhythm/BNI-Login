"use client";

import Image from "next/image";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <Image
        src="/images/Logo.png"
        alt="BNI"
        width={220}
        height={220}
        priority
        className="animate-pulse"
      />
    </div>
  );
}