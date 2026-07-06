"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMemberOffers } from "@/lib/api";
import toast from "react-hot-toast";
import type { Member } from "@/types";

interface BusinessHeroProps {
  member: Member;
}

export function BusinessHero({ member }: BusinessHeroProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [totalViews, setTotalViews] = useState(0);
  const [totalRedemptions, setTotalRedemptions] = useState(0);
  const [redemptionRate, setRedemptionRate] = useState(0);

  useEffect(() => {
    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token") ||
      "";
    getMemberOffers(token)
      .then((res) => {
        if (res?.success && res.offers) {
          const views = res.offers.reduce(
            (sum: number, o: any) => sum + (o.views || 0),
            0,
          );
          const redemptions = res.offers.reduce(
            (sum: number, o: any) => sum + (o.redemptions || 0),
            0,
          );
          const rate = views > 0 ? Math.round((redemptions / views) * 100) : 0;
          setTotalViews(views);
          setTotalRedemptions(redemptions);
          setRedemptionRate(rate);
        }
      })
      .catch(() => {
        toast.error("Failed to fetch member offers.");
      });
  }, []);

  const coverPhoto = member.cover_photo
    ? member.cover_photo.startsWith("http")
      ? member.cover_photo
      : `${process.env.NEXT_PUBLIC_STORAGE_URL}${member.cover_photo}`
    : "/images/coverphoto.jpg";

  const logoPhoto = member.business_logo
    ? member.business_logo.startsWith("http")
      ? member.business_logo
      : `${process.env.NEXT_PUBLIC_STORAGE_URL}${member.business_logo}`
    : "/images/logo.png";

  const handleCreateOffer = async () => {
    setChecking(true);
    try {
      const token =
        localStorage.getItem("member_token") ||
        sessionStorage.getItem("member_token") ||
        "";
      const res = await getMemberOffers(token);
      const offerCount = res.offers ? res.offers.length : 0;
      const offerLimit = member.offer_limit ?? 1;

      if (offerCount >= offerLimit) {
        toast.error(
          `You have reached your offer limit of ${offerLimit}. Please contact the administrator to upgrade your package.`,
          {
            duration: 3000,
          },
        );
        return;
      }

      router.push("/dashboard/offers/create");
    } catch {
      router.push("/dashboard/offers/create");
    } finally {
      setChecking(false);
    }
  };

  const stats = [
    { value: totalViews.toLocaleString(), label: "Total Views" },
    { value: `${redemptionRate}%`, label: "Redemption Rate" },
    { value: totalRedemptions.toLocaleString(), label: "Total Redemptions" },
  ];

  const mobileStats = [
    {
      value: totalViews.toLocaleString(),
      label: "Total Views",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
          <path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      value: `${redemptionRate}%`,
      label: "Redemption Rate",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
          <path
            d="M3 17l6-6 4 4 8-8M21 7v6M21 7h-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      value: totalRedemptions.toLocaleString(),
      label: "Total Redemptions",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
          <path
            d="M20 12v9H4v-9M2 7h20v5H2V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C9 2 12 7 12 7z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Desktop / laptop layout */}
      <div className="hidden min-[1025px]:block relative w-full rounded-2xl overflow-hidden mb-6">
        {/* Hero background */}
        <div className="w-full h-[280px] md:h-[360px] 2xl:h-[440px]">
          <img
            src={coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Business card — overlaps hero */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-4 md:mx-6 rounded-2xl p-4 md:p-5 2xl:p-7 2xl:max-w-[1100px] 2xl:mx-auto"
          style={{
            backgroundImage: "url('/images/background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex items-center gap-4 md:gap-5">
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 2xl:w-40 2xl:h-40 rounded-2xl bg-white flex-shrink-0 overflow-hidden p-3 shadow-md">
              <img
                src={logoPhoto}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Business Info */}
            <div className="min-w-0 flex-shrink-0 w-[140px] md:w-[180px] 2xl:w-[240px]">
              <h2 className="text-white font-bold text-[16px] md:text-[22px] 2xl:text-[30px] leading-tight truncate">
                {member.name || "Your Business"}
              </h2>
              <p className="!text-white text-[11px] md:text-[13px] 2xl:text-[15px] mt-0.5 truncate">
                {member.address || "Trivandrum, Kerala"}
              </p>
            </div>

            {/* Vertical divider */}
            <div
              className="w-px self-stretch flex-shrink-0"
              style={{ background: "rgb(255,255,255)" }}
            />

            {/* Right Section */}
            <div className="flex-1 flex flex-col justify-between h-[100px]">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="!text-white font-bold text-[14px] md:text-[18px] 2xl:text-[24px]">
                      {stat.value}
                    </p>
                    <p className="!text-white !text-[12px] md:!text-[13px] 2xl:!text-[16px] mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="flex items-center justify-center h-9 gap-2 px-6 py-2 md:px-7 md:py-2 rounded-md text-[12px] md:text-[15px] font-semibold whitespace-nowrap cursor-pointer border border-[#F8C600] text-[#F8C600] bg-transparent transition-colors duration-200 hover:bg-[#F8C600] hover:text-[#f4f4f4]"
                >
                  View My Profile
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                    <path
                      d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleCreateOffer}
                  disabled={checking}
                  className="flex text-white items-center justify-center h-9 gap-2 px-6 py-2 md:px-7 md:py-2 rounded-md text-[12px] md:text-[15px] font-semibold whitespace-nowrap cursor-pointer disabled:cursor-not-allowed bg-[#C31526] transition-colors duration-200 hover:bg-[#a8101f] disabled:opacity-70"
                >
                  {checking ? "Please Waite......" : "Create new offer"}
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Small / medium (tablet & mobile) layout */}
      <div
        className="min-[1025px]:hidden w-full rounded-2xl p-4 md:p-5 mb-6"
        style={{
          background:
            "linear-gradient(160deg, rgba(193,20,43,1) 0%, rgba(80,6,15,1) 100%)",
        }}
      >
        {/* Top: logo + name */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex-shrink-0 overflow-hidden p-2 shadow-md">
            <img
              src={logoPhoto}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-white font-bold text-[18px] md:text-[22px] leading-tight truncate">
              {member.name || "Your Business"}
            </h2>
            <p className="!text-white/70 text-[13px] md:text-[14px] mt-0.5 truncate">
              {member.address || "Trivandrum, Kerala"}
            </p>
          </div>
        </div>

        {/* Stat rows */}
        <div className="space-y-3 mb-5">
          {mobileStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 bg-white/10 rounded-xl p-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="!text-white font-bold text-[18px] leading-tight">
                  {stat.value}
                </p>
                <p className="!text-white/70 text-[12px] mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard/profile")}
            className="w-full flex items-center justify-center h-11 gap-2 rounded-xl text-[14px] font-semibold cursor-pointer border border-[#F8C600] text-[#F8C600] bg-transparent transition-colors duration-200 hover:bg-[#F8C600] hover:text-[#f4f4f4]"
          >
            View My Profile
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path
                d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleCreateOffer}
            disabled={checking}
            className="w-full flex text-white items-center justify-center h-11 gap-2 rounded-xl text-[14px] font-semibold cursor-pointer disabled:cursor-not-allowed bg-[#C31526] transition-colors duration-200 hover:bg-[#a8101f] disabled:opacity-70"
          >
            {checking ? "Please Waite......" : "Create new offer"}
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
