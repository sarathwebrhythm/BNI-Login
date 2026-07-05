"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  getOfferCategories,
  getMemberOffers,
  createOffer,
  updateOffer,
} from "@/lib/api";
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
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [member, setMember] = useState<Member | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token");
    const memberData =
      localStorage.getItem("member") || sessionStorage.getItem("member");
    if (!token) {
      router.push("/");
      return;
    }
    if (memberData) setMember(JSON.parse(memberData));

    getOfferCategories(token).then((res) => {
      if (res.success && res.categories) setCategories(res.categories);
    });
  }, [router]);

  useEffect(() => {
    if (!id) return;

    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token") ||
      "";

    getMemberOffers(token).then((res) => {
      if (res.success && res.offers) {
        const offer = res.offers.find((o: any) => o.id === Number(id));

        if (!offer) return;

        setForm({
          discount: offer.discount || "",
          offer_category_id: String(offer.offer_category_id || ""),
          description: offer.description || "",
          start_date: offer.start_date
            ? offer.start_date.replace(" ", "T").slice(0, 16)
            : "",
          end_date: offer.end_date
            ? offer.end_date.replace(" ", "T").slice(0, 16)
            : "",
          terms: offer.terms || [],
          contact_number: offer.contact_number || "",
        });

        if (offer.image) {
          const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
          setImagePreview(
            offer.image.startsWith("http")
              ? offer.image
              : `${storageUrl}${offer.image}`,
          );
        }
      }
    });
  }, [id]);

  const handleChange = (field: keyof OfferForm, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB!");
      return;
    }
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
    // setError("");

    if (!form.discount.trim()) {
      toast.error("Discount is required!");
      return;
    }

    if (form.discount.trim().length > 30) {
      toast.error("Discount must be less than 30 characters!");
      return;
    }
    if (!form.start_date) {
      toast.error("Start date is required!");
      return;
    }
    if (!form.end_date) {
      toast.error("End date is required!");
      return;
    }
    if (form.end_date <= form.start_date) {
      toast.error("End date must be after start date!");
      return;
    }
    if (!form.offer_category_id) {
      toast.error("Please select a category!");
      return;
    }
    if (!form.contact_number.trim()) {
      toast.error("Contact number is required!");
      return;
    }

    if (!/^[0-9+\-\s()]{8,15}$/.test(form.contact_number.trim())) {
      toast.error("Please enter a valid contact number!");
      return;
    }
    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token") ||
      "";
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("discount", form.discount.trim());
      if (form.offer_category_id)
        formData.append("offer_category_id", form.offer_category_id);
      if (form.description) formData.append("description", form.description);
      formData.append("start_date", form.start_date);
      formData.append("end_date", form.end_date);
      form.terms.forEach((term, i) => formData.append(`terms[${i}]`, term));
      if (form.contact_number.trim()) {
        formData.append("contact_number", form.contact_number.trim());
      }

      if (imageFile) formData.append("image", imageFile);

      let res;

      if (id) {
        res = await updateOffer(Number(id), formData, token);
      } else {
        res = await createOffer(formData, token);
      }

      if (res.success) {
        toast.success(
          id ? "Offer updated successfully!" : "Offer created successfully!",
        );

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.error(
          res.message ||
            (id ? "Failed to update offer." : "Failed to create offer."),
        );
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
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
              {id ? "Edit Offer" : "Create New Offer"}
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
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
                  <h2 className="text-[15px] md:text-[16px] 2xl:text-[20px] font-bold text-dark mb-4">
                    Offer Image
                  </h2>
                  <div
                    className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => imageRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-10 h-10 text-gray-300 mx-auto mb-2"
                        >
                          <path
                            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-[13px] text-muted">
                          Click to upload image
                        </p>
                        <p className="text-[11px] text-muted mt-1">
                          JPG, PNG up to 2MB
                        </p>
                      </div>
                    )}
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:opacity-80"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-4 h-4"
                        >
                          <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImage}
                  />
                </div>

                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm  space-y-4">
                  <h2 className="text-[15px] md:text-[16px] 2xl:text-[20px] font-bold text-dark mb-1">
                    Terms & Conditions
                  </h2>
                  <p className="text-[11px] md:text-[12px] text-muted mb-3">
                    Type one term, then press{" "}
                    <span className="font-semibold text-dark">Enter</span> or
                    click <span className="font-semibold text-dark">Add</span>{" "}
                    to add it as a bullet point.
                  </p>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={termInput}
                      onChange={(e) => setTermInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTerm();
                        }
                      }}
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
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[13px] md:text-[14px] text-dark bg-gray-50 rounded-lg px-3 py-2"
                        >
                          <span className="text-primary mt-0.5">•</span>
                          <span className="flex-1">{term}</span>
                          <button
                            type="button"
                            onClick={() => removeTerm(i)}
                            className="text-red-400 hover:text-red-600 flex-shrink-0"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="w-4 h-4"
                            >
                              <path
                                d="M18 6L6 18M6 6l12 12"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {form.terms.length === 0 && (
                    <p className="text-[12px] text-muted text-center py-4">
                      No terms added yet
                    </p>
                  )}

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
                      onChange={(e) =>
                        handleChange("offer_category_id", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] md:text-[14px] 2xl:text-[16px] text-dark focus:outline-none focus:border-primary"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold text-muted uppercase tracking-wide mb-1">
                      Description{" "}
                      <span className="text-gray-400 text-[10px] normal-case">
                        (max 1000 chars)
                      </span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      maxLength={1000}
                      rows={4}
                      placeholder="Describe your offer..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] md:text-[14px] 2xl:text-[16px] text-dark focus:outline-none focus:border-primary resize-none"
                    />
                    <p className="text-[11px] text-muted text-right mt-1">
                      {form.description.length}/1000
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
                <h2 className="text-[15px] md:text-[16px] 2xl:text-[20px] font-bold text-dark mb-2">
                  Offer Details
                </h2>

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
                    onChange={(e) =>
                      handleChange("contact_number", e.target.value)
                    }
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] md:text-[14px] 2xl:text-[16px] text-dark focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
                  <h2 className="text-[15px] md:text-[16px] 2xl:text-[20px] font-bold text-dark mb-4">
                    Live Preview
                  </h2>

                  <div className="flex justify-start">
                    <div className="w-full max-w-[300px] rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                      {/* Image */}
                      <div className="relative h-44 bg-gray-100 overflow-hidden">
                        <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-md z-10">
                          {form.discount || "20% OFF"}
                        </span>

                        <button
                          type="button"
                          className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-4 h-4 text-gray-500"
                          >
                            <path
                              d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </button>

                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            Upload an image
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <p className="text-xs text-muted truncate">
                          {categories.find(
                            (c) => c.id === Number(form.offer_category_id),
                          )?.name || "Category"}
                        </p>

                        <h3 className="text-sm font-semibold text-dark mt-1 truncate">
                          {member?.company || "Business Name"}
                        </h3>

                        <p className="text-xs text-muted mt-2 line-clamp-2 min-h-[36px]">
                          {form.description ||
                            "Your offer description will appear here..."}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src="/images/user (1).png"
                              alt=""
                              className="w-3 h-3"
                            />

                            <span className="text-xs text-muted truncate">
                              {member?.chapter || "Chapter"}
                            </span>
                          </div>

                          <div className="w-7 h-7 rounded-full bg-[#F7F2EF] flex items-center justify-center">
                            <img
                              src="/images/right-arrow (1).png"
                              alt=""
                              className="w-3 h-3"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl text-white text-[14px] md:text-[15px] 2xl:text-[16px] font-semibold transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(193,20,43,1) 0%, rgba(110,9,20,1) 100%)",
                  }}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {id ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      {id ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-4 h-4"
                        >
                          <path
                            d="M5 12l5 5L20 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-4 h-4"
                        >
                          <path
                            d="M12 5v14M5 12h14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                      {id ? "Update Offer" : "Submit Offer"}
                    </>
                  )}
                </button>

                <p className="text-[11px] md:text-[12px] text-muted text-center">
                  {id
                    ? "Update your offer details and save the changes."
                    : "Your offer will be reviewed by admin before going live."}
                </p>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
