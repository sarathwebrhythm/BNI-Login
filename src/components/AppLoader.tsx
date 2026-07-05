"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SplashScreen from "./SplashScreen";

export default function AppLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [showSplash, setShowSplash] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Splash only on login page
    if (pathname !== "/") {
      setReady(true);
      return;
    }

    const loaded = sessionStorage.getItem("app_loaded");

    if (loaded) {
      setReady(true);
      return;
    }

    setShowSplash(true);

    const timer = setTimeout(() => {
      sessionStorage.setItem("app_loaded", "true");
      setShowSplash(false);
      setReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Wait until we know whether to show the splash
  if (!ready && !showSplash) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}