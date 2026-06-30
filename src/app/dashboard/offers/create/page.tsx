"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { getOfferCategories, createOffer } from "@/lib/api";
import type { Member } from "@/types";

interface Category {
  id: number;
  name: string;
}

interface OfferForm {
  discount: string;
  offer_category_id: string;
  description: string;
  start_date: string;
  end_date: string;
  terms: string[];
  contact_number: string;
}

export default function CreateOfferPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [termInput, setTermInput] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<OfferForm>({
    discount: "",
    offer_category_id: "",
    description: "",
    start_date: "",
    end_date: "",
    terms: [],
    contact_number: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("member_token") || sessionStorage.getItem("member_token");
    const memberData = localStorage.getItem("member") || sessionStorage.getItem("member");
    if (!token) { router.push("/"); return; }
    if (memberData) setMember(JSON.parse(memberData));

    getOfferCategories(token).then((res) => {
      console.log("Categories response:", res);
      if (res.success && res.categories) setCategories(res.categories);
    });
  }, [router]);

  const handleChange = (field: keyof OfferForm, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setError("");
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Image must be less than 2MB!"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addTerm = () => {
    if (!termInput.trim()) return;
    setForm((p) => ({ ...p, terms: [...p.terms, termInput.trim()] }));
    setTermInput("");
  };

  const removeTerm = (index: number) => {
    setForm((p) => ({ ...p, terms: p.terms.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.discount) { setError("Discount is required!"); return; }
    if (!form.start_date) { setError("Start date is required!"); return; }
    if (!form.end_date) { setError("End date is required!"); return; }
    if (form.end_date <= form.start_date) { setError("End date must be after start date!"); return; }

    const token = localStorage.getItem("member_token") || sessionStorage.getItem("member_token") || "";
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("discount", form.discount);
      if (form.offer_category_id) formData.append("offer_category_id", form.offer_category_id);
      if (form.description) formData.append("description", form.description);
      formData.append("start_date", form.start_date);
      formData.append("end_date", form.end_date);
      form.terms.forEach((term, i) => formData.append(`terms[${i}]`, term));
      if (form.contact_number) formData.append("contact_number", form.contact_number);
      if (imageFile) formData.append("image", imageFile);

      const res = await createOffer(formData, token);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(res.message || "Failed to create offer.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!member) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-background">
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
            <h1 className="text-[20px] md:text-[24px] 2xl:text-[32px] font-bold text-dark">Create New Offer</h1>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[13px] md:text-[14px] font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{ background: "linear-gradient(90deg, rgba(193,20,43,1) 0%, rgba(110,9,20,1) 100%)", boxShadow: "0 1px 37px 0 rgba(251,12,12,0.4)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-[14px] font-medium flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Offer created successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[14px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="space-y-5">

                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
                  <h2 className="text-[15px] md:text-[16px] 2xl:text-[20px] font-bold text-dark mb-4">Offer Image</h2>
                  <div
                    className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => imageRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-gray-300 mx-auto mb-2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-[13px] text-muted">Click to upload image</p>
                        <p className="text-[11px] text-muted mt-1">JPG, PNG up to 2MB</p>
                      </div>
                    )}
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:opacity-80"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </div>

                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
                  <h2 className="text-[15px] md:text-[16px] 2xl:text-[20px] font-bold text-dark mb-1">Terms & Conditions</h2>
                  <p className="text-[11px] md:text-[12px] text-muted mb-3">
                    Type one term, then press <span className="font-semibold text-dark">Enter</span> or click <span className="font-semibold text-dark">Add</span> to add it as a bullet point.
                  </p>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={termInput}
                      onChange={(e) => setTermInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTerm(); } }}
                      placeholder="e.g. Valid only on weekdays"
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] md:text-[14px] text-dark focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={addTerm}
                      className="px-4 py-2.5 bg-primary text-white rounded-xl text-[13px] font-medium hover:opacity-90"
                    >
                      Add
                    </button>
                  </div>
                  {form.terms.length > 0 && (
                    <ul className="space-y-2">
                      {form.terms.map((term, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] md:text-[14px] text-dark bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="flex-1">{term}</span>
                          <button type="button" onClick={() => removeTerm(i)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {form.terms.length === 0 && (
                    <p className="text-[12px] text-muted text-center py-4">No terms added yet</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
                <h2 className="text-[15px] md:text-[16px] 2xl:text-[20px] font-bold text-dark mb-2">Offer Details</h2>

                <div>
                  <label className="block text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold text-muted uppercase tracking-wide mb-1">
                    Discount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.discount}
                    onChange={(e) => handleChange("discount", e.target.value)}
                    placeholder="e.g. 25% OFF, ₹100 off"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] md:text-[14px] 2xl:text-[16px] text-dark focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold text-muted uppercase tracking-wide mb-1">
                    Category
                  </label>
                  <select
                    value={form.offer_category_id}
                    onChange={(e) => handleChange("offer_category_id", e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] md:text-[14px] 2xl:text-[16px] text-dark focus:outline-none focus:border-primary"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold text-muted uppercase tracking-wide mb-1">
                    Description <span className="text-gray-400 text-[10px] normal-case">(max 1000 chars)</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    maxLength={1000}
                    rows={4}
                    placeholder="Describe your offer..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] md:text-[14px] 2xl:text-[16px] text-dark focus:outline-none focus:border-primary resize-none"
                  />
                  <p className="text-[11px] text-muted text-right mt-1">{form.description.length}/1000</p>
                </div>

                <div>
                  <label className="block text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold text-muted uppercase tracking-wide mb-1">
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={form.start_date}
                    onChange={(e) => handleChange("start_date", e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] md:text-[14px] 2xl:text-[16px] text-dark focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold text-muted uppercase tracking-wide mb-1">
                    End Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={form.end_date}
                    onChange={(e) => handleChange("end_date", e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] md:text-[14px] 2xl:text-[16px] text-dark focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold text-muted uppercase tracking-wide mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={form.contact_number}
                    onChange={(e) => handleChange("contact_number", e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] md:text-[14px] 2xl:text-[16px] text-dark focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl text-white text-[14px] md:text-[15px] 2xl:text-[16px] font-semibold transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  style={{ background: "linear-gradient(90deg, rgba(193,20,43,1) 0%, rgba(110,9,20,1) 100%)" }}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Submit Offer
                    </>
                  )}
                </button>

                <p className="text-[11px] md:text-[12px] text-muted text-center">
                  Your offer will be reviewed by admin before going live.
                </p>
              </div>

            </div>
          </form>
        </main>
      </div>
    </div>
  );
}