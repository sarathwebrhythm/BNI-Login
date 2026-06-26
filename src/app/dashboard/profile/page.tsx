"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import {
  uploadProfilePhoto,
  uploadCoverPhoto,
  uploadBusinessLogo,
} from "@/lib/api";
import type { Member } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [uploading, setUploading] = useState<string | null>(null);

  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token");
    const memberData =
      localStorage.getItem("member") || sessionStorage.getItem("member");
    if (!token) {
      router.push("/");
      return;
    }
    if (memberData) {
      const parsed = JSON.parse(memberData);
      const base = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
      const toUrl = (path?: string) => {
        if (!path) return undefined;
        if (path.startsWith("http")) return path;
        return `${base}${path}`;
      };
      setMember(parsed);
      setPhotoUrl(toUrl(parsed.profile_photo));
      setCoverUrl(toUrl(parsed.cover_photo));
      setLogoUrl(toUrl(parsed.business_logo));
    }
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/member/profile`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.member) {
          const base = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

          const toUrl = (path?: string) => {
            if (!path) return undefined;
            if (path.startsWith("http")) return path;
            return `${base}${path}`;
          };

          const updatedMember = {
            ...data.member,
            profile_photo: toUrl(data.member.profile_photo),
            cover_photo: toUrl(data.member.cover_photo),
            business_logo: toUrl(data.member.business_logo),
          };

          setMember(updatedMember);

          setPhotoUrl(updatedMember.profile_photo);
          setCoverUrl(updatedMember.cover_photo);
          setLogoUrl(updatedMember.business_logo);
        }
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, [router]);

  const handleProfilePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !member) return;
    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token") ||
      "";
    setPhotoUrl(URL.createObjectURL(file));
    setUploading("photo");
    try {
      const res = await uploadProfilePhoto(file, token);
      console.log("Profile photo response:", res);
      if (res.success && res.photo_url) {
        const fullUrl = `${process.env.NEXT_PUBLIC_STORAGE_URL}${res.photo_url}`;
        setPhotoUrl(fullUrl);

        
        setMember((prev) =>
          prev
            ? {
                ...prev,
                profile_photo: fullUrl,
              }
            : prev,
        );

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
          window.dispatchEvent(new Event("member-updated"));
        }
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(null);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      alert("Logo must be less than 1MB!");
      return;
    }
    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token") ||
      "";
    setLogoUrl(URL.createObjectURL(file));
    setUploading("logo");
    try {
      const res = await uploadBusinessLogo(file, token);
      console.log("Logo upload response:", res);
      if (res.success && res.logo_url) {
        const fullUrl = `${process.env.NEXT_PUBLIC_STORAGE_URL}${res.logo_url}`;
        setLogoUrl(fullUrl);
        const stored =
          localStorage.getItem("member") || sessionStorage.getItem("member");
        if (stored) {
          const memberData = JSON.parse(stored);
          memberData.business_logo = fullUrl;
          if (localStorage.getItem("member_token")) {
            localStorage.setItem("member", JSON.stringify(memberData));
          } else {
            sessionStorage.setItem("member", JSON.stringify(memberData));
          }
          window.dispatchEvent(new Event("member-updated"));
        }
      }
    } catch (err) {
      console.error("Logo upload failed", err);
    } finally {
      setUploading(null);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Cover photo must be less than 5MB!");
      return;
    }
    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token") ||
      "";
    setCoverUrl(URL.createObjectURL(file));
    setUploading("cover");
    try {
      const res = await uploadCoverPhoto(file, token);
      console.log("Cover upload response:", res);
      if (res.success && res.cover_url) {
        const fullUrl = `${process.env.NEXT_PUBLIC_STORAGE_URL}${res.cover_url}`;
        setCoverUrl(fullUrl);
        const stored =
          localStorage.getItem("member") || sessionStorage.getItem("member");
        if (stored) {
          const memberData = JSON.parse(stored);
          memberData.cover_photo = fullUrl;
          if (localStorage.getItem("member_token")) {
            localStorage.setItem("member", JSON.stringify(memberData));
          } else {
            sessionStorage.setItem("member", JSON.stringify(memberData));
          }
        }
      }
    } catch (err) {
      console.error("Cover upload failed", err);
    } finally {
      setUploading(null);
    }
  };

  if (!member) {
    return (
      <div
        suppressHydrationWarning
        className="min-h-screen flex items-center justify-center bg-background"
      >
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar member={member} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[20px] md:text-[24px] 2xl:text-[32px] font-bold text-dark">
              My Profile
            </h1>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[13px] md:text-[14px] font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(193,20,43,1) 0%, rgba(110,9,20,1) 100%)",
                boxShadow: "0 1px 37px 0 rgba(251,12,12,0.4)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path
                  d="M19 12H5M5 12l7 7M5 12l7-7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Section — LEFT */}
            <div className="bg-white rounded-2xl p-5 md:p-6 2xl:p-8 shadow-sm">
              <h2 className="text-[16px] md:text-[18px] 2xl:text-[24px] font-bold text-dark mb-5">
                Business Info
              </h2>

              {/* Profile Photo */}
              <div className="mb-5">
                <label className="block text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold text-muted uppercase tracking-wide mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-20 h-20 md:w-24 md:h-24 2xl:w-28 2xl:h-28 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center cursor-pointer"
                      onClick={() => photoRef.current?.click()}
                    >
                      {photoUrl ? (
                        <img
                          src={
                            photoUrl?.startsWith("http")
                              ? photoUrl
                              : `${process.env.NEXT_PUBLIC_STORAGE_URL}${photoUrl}`
                          }
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[28px] md:text-[32px] font-bold text-gray-400">
                          {member.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => photoRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {uploading === "photo" ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-3.5 h-3.5"
                        >
                          <path
                            d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </button>
                    <input
                      ref={photoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePhoto}
                    />
                  </div>
                  <div>
                    <p className="text-[13px] md:text-[14px] 2xl:text-[16px] font-medium text-dark">
                      {member.name}
                    </p>
                    <p className="text-[11px] md:text-[12px] 2xl:text-[14px] text-muted mt-0.5">
                      Click pencil to change photo
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Photo */}
              <div className="mb-5">
                <label className="block text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold text-muted uppercase tracking-wide mb-2">
                  Cover Photo
                </label>
                <div className="relative w-full h-32 md:h-40 2xl:h-48 rounded-xl overflow-hidden">
                  <img
                    src={
                      coverUrl
                        ? coverUrl.startsWith("http")
                          ? coverUrl
                          : `${process.env.NEXT_PUBLIC_STORAGE_URL}${coverUrl}`
                        : "/images/coverphoto.jpg"
                    }
                    alt="Cover"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => coverRef.current?.click()}
                  />
                  <button
                    type="button"
                    onClick={() => coverRef.current?.click()}
                    className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shadow-md"
                  >
                    {uploading === "cover" ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                  <input
                    ref={coverRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                </div>
              </div>

              {/* Company Logo */}
              <div className="mb-5">
                <label className="block text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold text-muted uppercase tracking-wide mb-2">
                  Company Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-24 md:w-40 md:h-28 2xl:w-48 2xl:h-32 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                    <img
                      src={
                        logoUrl
                          ? logoUrl.startsWith("http")
                            ? logoUrl
                            : `${process.env.NEXT_PUBLIC_STORAGE_URL}${logoUrl}`
                          : "/images/logo.png"
                      }
                      alt="Logo"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => logoRef.current?.click()}
                    />
                    <button
                      type="button"
                      onClick={() => logoRef.current?.click()}
                      className="absolute bottom-1 right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shadow-md"
                    >
                      {uploading === "logo" ? (
                        <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-3 h-3"
                        >
                          <path
                            d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </button>
                    <input
                      ref={logoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>
                  <div>
                    <p className="text-[13px] md:text-[14px] 2xl:text-[16px] font-medium text-dark">
                      Company Logo
                    </p>
                    <p className="text-[11px] md:text-[12px] 2xl:text-[14px] text-muted mt-0.5">
                      PNG, JPG up to 1MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Section — RIGHT */}
            <div className="bg-white rounded-2xl p-5 md:p-6 2xl:p-8 shadow-sm">
              <h2 className="text-[16px] md:text-[18px] 2xl:text-[24px] font-bold text-dark mb-5">
                Profile Info
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Full Name", value: member.name },
                  { label: "Phone", value: member.phone },
                  { label: "Email", value: member.email },
                  { label: "Designation", value: member.designation || "—" },
                  { label: "Chapter", value: member.chapter || "—" },
                  { label: "BNI ID", value: member.bni_id },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold text-muted uppercase tracking-wide mb-1">
                      {field.label}
                    </label>
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] md:text-[14px] 2xl:text-[16px] text-dark">
                      {field.value}
                    </div>
                  </div>
                ))}
                <p className="text-[11px] md:text-[12px] 2xl:text-[13px] text-muted flex items-center gap-1 mt-2">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 8v4M12 16h.01"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Contact admin to update personal details
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
