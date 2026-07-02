"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMemberOffers } from "@/lib/api";
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
    const token = localStorage.getItem("member_token") || sessionStorage.getItem("member_token") || "";
    getMemberOffers(token)
      .then((res) => {
        if (res?.success && res.offers) {
          const views = res.offers.reduce((sum: number, o: any) => sum + (o.views || 0), 0);
          const redemptions = res.offers.reduce((sum: number, o: any) => sum + (o.redemptions || 0), 0);
          const rate = views > 0 ? Math.round((redemptions / views) * 100) : 0;
          setTotalViews(views);
          setTotalRedemptions(redemptions);
          setRedemptionRate(rate);
        }
      })
      .catch(() => {});
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
      const token = localStorage.getItem("member_token") || sessionStorage.getItem("member_token") || "";
      const res = await getMemberOffers(token);
      const offerCount = res.offers ? res.offers.length : 0;
      const offerLimit = member.offer_limit ?? 1;

      if (offerCount >= offerLimit) {
        alert(`You have reached your offer limit of ${offerLimit}. Please contact admin to upgrade your package.`);
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

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-6">
      {/* Hero background */}
      <div className="w-full h-[280px] md:h-[360px] 2xl:h-[440px]">
        <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover object-center" />
      </div>

      {/* Business card — overlaps hero */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-4 md:mx-6 rounded-2xl p-4 md:p-5 2xl:p-7"
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
            <img src={logoPhoto} alt="Logo" className="w-full h-full object-contain" />
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
          <div className="w-px self-stretch flex-shrink-0" style={{ background: "rgb(255,255,255)" }} />

          {/* Right Section */}
          <div className="flex-1 flex flex-col justify-between h-[100px]">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="!text-white font-bold text-[14px] md:text-[18px] 2xl:text-[24px]">{stat.value}</p>
                  <p className="!text-white !text-[12px] md:!text-[13px] 2xl:!text-[16px] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="flex items-center justify-center h-9 gap-2 px-6 py-2 md:px-7 md:py-2 rounded-xl text-[12px] md:text-[15px] font-semibold whitespace-nowrap"
                style={{ border: "1px solid #F8C600", color: "#F8C600", background: "transparent", borderRadius: "6px" }}
              >
                View my page
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={handleCreateOffer}
                disabled={checking}
                className="flex text-white items-center justify-center h-9 gap-2 px-6 py-2 md:px-7 md:py-2 rounded-xl text-[12px] md:text-[15px] font-semibold whitespace-nowrap disabled:opacity-70"
                style={{ background: "#C31526", borderRadius: "6px" }}
              >
                {checking ? "Checking..." : "Create new offer"}
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}