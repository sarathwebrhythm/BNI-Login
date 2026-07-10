import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Figtree } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AppLoader from "@/components/AppLoader";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BNI Privilege Card — Trivandrum Member Login",
  description:
    "Sign in to your BNI Trivandrum Privilege Card account. Unlock exclusive member benefits, grow connections, and expand opportunities.",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* <AppLoader>{children}</AppLoader> */}
        <Suspense fallback={null}>
          <AppLoader>{children}</AppLoader>
        </Suspense>
        <Toaster
          position="top-center"
          gutter={12}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#15803d", // Dark green
              color: "#fff",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "14px",
              fontWeight: 500,
              minWidth: "320px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            },
            success: {
              iconTheme: {
                primary: "#ffffff",
                secondary: "#15803d",
              },
            },
            error: {
              style: {
                background: "#dc2626",
              },
              iconTheme: {
                primary: "#ffffff",
                secondary: "#dc2626",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
