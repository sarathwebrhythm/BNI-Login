import React from "react";
import Image from "next/image";

interface Feature {
  iconSrc: string;
  iconAlt: string;
  title: string;
  subtitle: string;
}

const features: Feature[] = [
  {
    iconSrc: "/images/Vector-1.png",   
    iconAlt: "Exclusive Member Benefits",
    title: "Exclusive",
    subtitle: "Member Benefits",
  },
  {
    iconSrc: "/images/Vector-2.png",   
    iconAlt: "Trusted Business Network",
    title: "Trusted Business",
    subtitle: "Network",
  },
  {
    iconSrc: "/images/Vector-3.png",    
    iconAlt: "Grow Connect Succeed",
    title: "Grow. Connect.",
    subtitle: "Succeed.",
  },
];

export function LeftPanel() {
  return (
    <div className="relative flex flex-col h-full bg-background overflow-hidden px-10 py-10 lg:px-14 lg:py-12">

      {/* Network background image — top portion only, overlaid + faded */}
      <div className="absolute inset-x-0 top-0 h-[62%] pointer-events-none">
        <Image
          src="/images/network.jpg"
          alt=""
          fill
          priority
          className="object-cover object-top opacity-40"
          aria-hidden="true"
        />
        {/* White/bg overlay to mute the image */}
        <div className="absolute inset-0 bg-background/60" />
        {/* Gradient fade to background at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 50%, #F3F3F3 90%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Logo */}
        <div>
          <Image
            src="/images/logo-login.png"
            alt="BNI Trivandrum"
            width={160}
            height={60}
            priority
            className="object-contain"
          />
        </div>

        {/* Hero text */}
        <div className="mt-16 lg:mt-20">
          <p className="!text-3xl lg:text-3xl font-normal !text-dark leading-snug">
            Welcome to the
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mt-1">
            <span className="text-primary">BNI</span>{" "}
            <span className="text-dark">Privilege Card</span>
          </h1>
          {/* Red underline accent */}
          <div className="w-20 h-[3px] bg-primary mt-2 mb-3" />
          <p className=" text-muted leading-relaxed">
            Unlock exclusive privileges.
            <br />
            Grow connections. Expand opportunities.
          </p>
        </div>

        {/* Feature icons */}
        <div className="mt-12 lg:mt-16 grid grid-cols-3 gap-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-start gap-3">
              {/* Icon circle with image */}
              <div className="w-14 h-14 rounded-full border border-[#adadad] bg-white/80 flex items-center justify-center shadow-sm overflow-hidden">
                <Image
                  src={feature.iconSrc}
                  alt={feature.iconAlt}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              {/* Label */}
              <div>
                <p className="text-sm text-muted leading-tight font-normal">
                  {feature.title}
                </p>
                <p className="text-sm text-muted leading-tight font-normal">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}