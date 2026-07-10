"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { uploadProfilePhoto } from "@/lib/api";
import type { Member } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Link from "next/link";

interface SidebarProps {
  member: Member;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "/images/Vector-25.png" },
  {
    label: "My Privilege Card",
    href: "#privilege-card",
    icon: "/images/Vector-26.png",
  },
  {
    label: "All Offers",
    href: "#offers-section",
    icon: "/images/Vector-27.png",
  },
  {
    label: "Categories",
    href: "#top-categories",
    icon: "/images/Vector-28.png",
  },
  {
    label: "Support",
    href: "/dashboard/support",
    icon: "/images/Vector-29.png",
  },
];

const promoOffers = [
  { title: "10% OFF All Products", image: "/images/offer1.jpg" },
  { title: "Buy 1 Get 1 Free", image: "/images/offer2.jpg" },
  { title: "Flat 25% OFF Restaurants", image: "/images/offer3.jpg" },
];

export function Sidebar({ member }: SidebarProps) {
  // const sidebarRef = useRef<HTMLDivElement>(null);
  const mobileSidebarRef = useRef<HTMLDivElement>(null);
  const desktopSidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(
    member.profile_photo,
  );
  const [activeOffer, setActiveOffer] = useState(0);
  const [activeNav, setActiveNav] = useState("/dashboard");

  useEffect(() => {
    setPhotoUrl(member.profile_photo);
  }, [member.profile_photo]);

  const handleLogout = () => {
    localStorage.removeItem("member_token");
    localStorage.removeItem("member");
    sessionStorage.removeItem("member_token");
    sessionStorage.removeItem("member");
    // router.push("/");
     window.location.href = "https://portal.bnitvm.com/Member/Dashboard";
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token") ||
      "";
    try {
      const res = await uploadProfilePhoto(file, token);
      if (res.success && res.photo_url) {
        const fullUrl = `${process.env.NEXT_PUBLIC_STORAGE_URL}${res.photo_url}`;
        setPhotoUrl(fullUrl);
        const stored =
          localStorage.getItem("member") || sessionStorage.getItem("member");
        if (stored) {
          const memberData = JSON.parse(stored);
          memberData.profile_photo = fullUrl;
          if (localStorage.getItem("member_token")) {
            localStorage.setItem("member", JSON.stringify(memberData));
          } else {
            sessionStorage.setItem("member", JSON.stringify(memberData));
          }
        }
      }
    } catch (err) {
      console.error("Photo upload failed", err);
    }
  };

  const SidebarContent = (
    scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  ) => (
    <div className="flex flex-col">
      <div className="px-[40px] 2xl:px-[100px] pt-8 pb-6">
        <Image
          src="/images/Layer-1.png"
          alt="BNI Trivandrum"
          width={100}
          height={38}
          className="object-contain"
        />
      </div>
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const isActive = activeNav === item.href;
          return (
            <button
              key={item.href}
              onClick={() => {
                setActiveNav(item.href);
                setIsOpen(false);

                if (item.href.startsWith("#")) {
                  const id = item.href.slice(1);

                  if (pathname === "/dashboard") {
                    // Tell TabSwitch to switch back to the User tab
                    window.dispatchEvent(new CustomEvent("switch-user-tab"));

                    // Give React time to render the User tab
                    setTimeout(() => {
                      document.getElementById(id)?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }, 150);
                  } else {
                    router.push(`/dashboard${item.href}`);
                  }
                } else {
                  router.push(item.href);
                }
              }}
              className={`
                w-full flex !text-white items-center gap-3 px-[20px] 2xl:px-[80px] py-3 rounded-xl mb-1
                text-14 2xl:text-lg font-medium transition-all duration-200 text-left
                ${isActive ? "text-white border border-white/20" : "text-white/70 hover:bg-white/10 hover:text-white"}
              `}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(90deg, rgba(193,20,43,1) 0%, rgba(110,9,20,1) 100%)",
                      boxShadow: "0 1px 37px 0 rgba(251,12,12,0.4)",
                    }
                  : {}
              }
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="text-center mx-4 mb-4 mt-8 rounded-2xl overflow-hidden bg-white/10 border border-white/15 p-4">
        <p className="!text-accent-yellow mb-1 !text-sm 2xl:!text-14">
          Featured ·{" "}
          <span className="!text-white text-sm 2xl:!text-14">
            Trending Now
          </span>
        </p>
        <h3 className="text-white font-bold text-xl leading-tight mb-1">
          Top Privileges This Month
        </h3>
        <p className="!text-white !text-sm 2xl:!text-14 !mb-4">
          {promoOffers[activeOffer].title}
        </p>
        <div className="mb-3 overflow-hidden rounded-xl">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            allowTouchMove={true}
            grabCursor={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
          >
            {promoOffers.map((offer, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-[120px]   2xl:h-[200px] rounded-xl overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <button className="gradient-border-btn w-full h-12 rounded-[10px] bg-transparent text-accent-yellow font-semibold flex items-center justify-center gap-3 transition-all duration-300 group">
          <span>Explore now</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
      <div className="mx-3 mb-4">
        <button
          onClick={() => {
            const opening = !profileOpen;
            setProfileOpen(opening);

            if (opening) {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  const container = scrollContainerRef.current;

                  if (!container) return;

                  container.scrollTo({
                    top: container.scrollHeight,
                    behavior: "smooth",
                  });
                }, 100);
              });
            }
          }}
          className="w-full flex items-center gap-4 px-2 py-2 rounded-2xl border border-white/15 transition-all duration-300 hover:brightness-125 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(90deg, rgba(193,20,43,1) 0%, rgba(110,9,20,1) 100%)",
            boxShadow: "0 1px 37px 0 rgba(251,12,12,0.4)",
          }}
        >
          <div
            className="relative flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl overflow-hidden cursor-pointer"
              onClick={() => router.push("/dashboard/profile")}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                member.name?.charAt(0).toUpperCase()
              )}
            </div>
            <label
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent-yellow rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              title="Edit profile"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/dashboard/profile");
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                <path
                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                  stroke="#251F20"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="#251F20"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
          <div className="flex-1 text-left">
            <p className="!text-white font-semibold text-sm leading-tight">
              {member.name}
            </p>
            <p className="!text-accent-yellow text-sm mt-1">
              {member.designation || "Member"}
            </p>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`w-6 h-6 text-accent-yellow transition-transform duration-300 ${profileOpen ? "rotate-180" : "animate-bounce"}`}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {profileOpen && (
          <div className="mt-1 bg-white/10 border border-white/15 rounded-xl overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full flex   items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white text-sm transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path
                  d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-1 left-4 z-50 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg"
        aria-label="Open menu"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-[320px] z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/background.jpg"
            alt=""
            className="w-full h-full object-cover object-[center_70%]"
            aria-hidden="true"
          />
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-[9999] w-8 h-8 flex items-center justify-center text-white/70 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {/* <div className="relative z-10 h-full"> */}
        <div
          ref={mobileSidebarRef}
          className="relative z-10 flex flex-col h-full overflow-y-auto overscroll-contain"
        >
          {SidebarContent(mobileSidebarRef)}
        </div>
      </div>
      <aside className="hidden lg:flex flex-col w-[320px] xl:w-[280px] 2xl:w-[400px] flex-shrink-0 relative h-screen sticky top-0">
        <img
          src="/images/background.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,.4)_50%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.1)_100%)]"></div>
        {/* <div className="relative z-10 flex flex-col h-full"> */}
        <div
          ref={desktopSidebarRef}
          className="relative z-10 flex flex-col h-full overflow-y-auto overscroll-contain pb-24"
        >
          {SidebarContent(desktopSidebarRef)}
        </div>
      </aside>
    </>
  );
}