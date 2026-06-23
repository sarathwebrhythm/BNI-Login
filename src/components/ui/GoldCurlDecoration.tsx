import React from "react";
import Image from "next/image";

export function GoldCurlDecoration() {
  return (
    <div className="absolute bottom-0 right-0 pointer-events-none z-[2] w-[260px] h-[320px]">
      {/* Outer arc line */}
      <Image
        src="/images/Vector-10.png"
        alt=""
        fill
        className="object-contain object-bottom-right"
        aria-hidden="true"
      />
      {/* Inner arc line — shifted left to reduce gap */}
      <div className="absolute inset-0 translate-x-[15px]">
        <Image
          src="/images/Vector-10.png"
          alt=""
          fill
          className="object-contain object-bottom-right"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}