import React from "react";

interface BniLogoProps {
  variant?: "red" | "gold";
  className?: string;
}

export function BniLogo({ variant = "red", className = "" }: BniLogoProps) {
  const primaryColor = variant === "red" ? "#CC0000" : "#C9A84C";
  const accentColor = variant === "red" ? "#CC0000" : "#E2B96A";

  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="BNI Logo"
      role="img"
    >
      {/* B */}
      <text
        x="0"
        y="52"
        fontFamily="Arial Black, Arial"
        fontWeight="900"
        fontSize="58"
        fill={primaryColor}
        letterSpacing="-2"
      >
        BNI
      </text>
      {/* Trademark dot/slash accent */}
      <rect x="104" y="8" width="6" height="6" rx="1" fill={accentColor} />
      {/* ® */}
      <text
        x="111"
        y="20"
        fontFamily="Arial"
        fontWeight="400"
        fontSize="10"
        fill={primaryColor}
      >
        ®
      </text>
    </svg>
  );
}
