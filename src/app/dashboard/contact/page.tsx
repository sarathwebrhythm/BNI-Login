"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Footer } from "@/components/dashboard/Footer";
import toast from "react-hot-toast";
import { submitContactForm } from "@/lib/api";
import type { Member } from "@/types";

const WHATSAPP_NUMBER = "919746829444"; // +91 97468 29444
const SUPPORT_EMAIL = "support@bni.com";
const SUPPORT_PHONE_DISPLAY = "+91 97468 29444";
const SUPPORT_PHONE_TEL = "+919746829444";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadMember = () => {
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
        setMember(parsed);
        // Pre-fill name/email/phone for a logged-in member
        setForm((p) => ({
          ...p,
          name: p.name || parsed.name || "",
          email: p.email || parsed.email || "",
          phone: p.phone || parsed.phone || "",
        }));
      }
    };

    loadMember();
    window.addEventListener("focus", loadMember);
    return () => window.removeEventListener("focus", loadMember);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (field in errors) {
      setErrors((p) => ({ ...p, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^[0-9+\-\s()]{8,15}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid mobile number";
    }
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token") ||
      "";

    setSubmitting(true);
    try {
      const res = await submitContactForm(form, token);
      if (res?.success) {
        toast.success("Message sent! We'll get back to you soon.");
        setForm((p) => ({ ...p, message: "" }));
      } else {
        toast.error(res?.message || "Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi, I need help with the BNI Trivandrum Privilege Card.",
  )}`;

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar member={member} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar member={member} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl md:text-2xl 2xl:text-32 font-bold text-dark">
              Contact &amp; Support
            </h1>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm md:text-14 font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
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
              Back 
            </button>
          </div>

          <div className="grid grid-cols-1 min-[1025px]:grid-cols-[1fr_360px] gap-6">
            {/* Contact form */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-base font-bold text-dark mb-6">
                Need help? Send us a message
              </h2>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs md:text-12 2xl:text-14 font-semibold text-muted uppercase tracking-wide mb-1.5"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Your name"
                      className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm md:text-14 2xl:text-base text-dark focus:outline-none transition-colors ${
                        errors.name
                          ? "border-red-400 focus:border-red-400"
                          : "border-gray-200 focus:border-primary"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs md:text-12 2xl:text-14 font-semibold text-muted uppercase tracking-wide mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="you@email.com"
                      className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm md:text-14 2xl:text-base text-dark focus:outline-none transition-colors ${
                        errors.email
                          ? "border-red-400 focus:border-red-400"
                          : "border-gray-200 focus:border-primary"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs md:text-12 2xl:text-14 font-semibold text-muted uppercase tracking-wide mb-1.5"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm md:text-14 2xl:text-base text-dark focus:outline-none transition-colors ${
                      errors.phone
                        ? "border-red-400 focus:border-red-400"
                        : "border-gray-200 focus:border-primary"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs md:text-12 2xl:text-14 font-semibold text-muted uppercase tracking-wide mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={3}
                    placeholder="Tell us how we can help..."
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm md:text-14 2xl:text-base text-dark focus:outline-none transition-colors resize-none ${
                      errors.message
                        ? "border-red-400 focus:border-red-400"
                        : "border-gray-200 focus:border-primary"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto px-8 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(193,20,43,1) 0%, rgba(110,9,20,1) 100%)",
                  }}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>

            {/* Quick contact / WhatsApp */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-base font-bold text-dark mb-4">
                  Quick Support
                </h2>
                <p className="text-sm text-muted mb-5 leading-relaxed">
                  Need a faster response? Chat with our support team directly
                  on WhatsApp.
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: "#25D366" }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.821.487 3.53 1.338 5.003L2 22l5.117-1.317A9.955 9.955 0 0012.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.181c-1.634 0-3.15-.474-4.432-1.291l-.318-.19-3.05.786.821-2.977-.207-.318A8.163 8.163 0 013.819 12c0-4.518 3.664-8.181 8.182-8.181 4.517 0 8.181 3.663 8.181 8.181 0 4.518-3.664 8.181-8.181 8.181z" />
                  </svg>
                  Chat on WhatsApp
                </a>
           
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <h2 className="text-base font-bold text-dark mb-4">
                  Other Ways to Reach Us
                </h2>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-start gap-3 group -m-1 p-1 rounded-lg hover:bg-gray-50 transition-colors mb-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#F6F4F1] flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-primary">
                      <path
                        d="M22 6l-10 7L2 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="2"
                        y="4"
                        width="20"
                        height="16"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Email
                    </p>
                    <p className="text-sm text-dark mt-0.5 group-hover:text-primary group-hover:underline transition-colors">
                      {SUPPORT_EMAIL}
                    </p>
                  </div>
                </a>
                <a
                  href={`tel:${SUPPORT_PHONE_TEL}`}
                  className="flex items-start gap-3 group -m-1 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#F6F4F1] flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-primary">
                      <path
                        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Phone
                    </p>
                    <p className="text-sm text-dark mt-0.5 group-hover:text-primary group-hover:underline transition-colors">
                      {SUPPORT_PHONE_DISPLAY}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}