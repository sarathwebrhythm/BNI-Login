import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AppLoader from "@/components/AppLoader";
import Script from "next/script";
import "./globals.css";

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
    <html lang="en" className="font-sans">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-P9XBJV3C');`}
        </Script>
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P9XBJV3C"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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
