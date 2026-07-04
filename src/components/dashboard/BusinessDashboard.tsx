"use client";

import React, { useState, useEffect } from "react";
import { BusinessHero } from "@/components/business/BusinessHero";
import { useRouter } from "next/navigation";
import { getMemberOffers, getRecentLeads, deleteOffer } from "@/lib/api";
import type { Member } from "@/types";

interface BusinessDashboardProps {
  member: Member;
}

interface Offer {
  id: number;
  discount: string;
  description?: string;
  status: string;
  views: number;
  redemptions: number;
  saves: number;
  start_date?: string;
  end_date?: string;
  image?: string;
  offer_category_id?: number;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    New: "bg-green-100 text-green-600",
    "Follow up": "bg-red-100 text-red-500",
    active: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    inactive: "bg-gray-100 text-gray-500",
    rejected: "bg-red-100 text-red-500",
  };
  return (
    <span className={`text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold px-2 py-0.5 rounded-full capitalize ${styles[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function BusinessDashboard({ member }: BusinessDashboardProps) {
  const router = useRouter();
  const [expandedOffer, setExpandedOffer] = useState<number | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);

  interface RecentLead {
    id: number;
    name: string;
    photo?: string;
    discount: string;
    action: string;
    time: string;
  }

  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("member_token") || sessionStorage.getItem("member_token") || "";
      const res = await deleteOffer(deleteTarget.id, token);
      if (res?.success) {
        setOffers((prev) => prev.filter((o) => o.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("member_token") || sessionStorage.getItem("member_token") || "";

    getMemberOffers(token)
      .then((res) => {
        if (res?.success && res.offers) setOffers(res.offers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    getRecentLeads(token)
      .then((res) => {
        if (res?.success && res.leads) setRecentLeads(res.leads);
      })
      .catch(() => {});
  }, []);

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

  return (
    <div>
      <BusinessHero member={member} />

      <div className="grid grid-cols-1 min-[1025px]:grid-cols-[1fr_360px] 2xl:grid-cols-[2fr_1.5fr] gap-6">
        {/* My Offers */}
        <div className="bg-white rounded-2xl p-4 md:p-5 2xl:p-8 shadow-sm">
          <h3 className="text-[16px] md:text-[18px] 2xl:text-[24px] font-bold text-dark mb-4">
            My Offers {!loading && `(${offers.length})`}
          </h3>

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-16 h-14 bg-gray-100 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && offers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[13px] text-muted">No offers yet.</p>
            </div>
          )}

          {!loading && offers.length > 0 && (
            <div className="space-y-3">
              {offers.map((offer) => {
                const imageUrl = offer.image
                  ? offer.image.startsWith("http") ? offer.image : `${storageUrl}${offer.image}`
                  : null;

                return (
                  <div key={offer.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedOffer(expandedOffer === offer.id ? null : offer.id)}
                    >
                      <div className="w-16 h-14 2xl:w-20 2xl:h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                        {imageUrl ? (
                          <img src={imageUrl} alt={offer.discount} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] md:text-[14px] 2xl:text-[18px] font-semibold text-dark truncate">
                          {offer.discount}
                        </p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-[11px] md:text-[12px] 2xl:text-[14px] text-muted flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            {formatDate(offer.end_date)}
                          </span>
                          <span className="text-[11px] md:text-[12px] 2xl:text-[14px] text-muted flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            {offer.views} views
                          </span>
                          <span className="text-[11px] md:text-[12px] 2xl:text-[14px] text-primary font-semibold flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7.5M17 13l1.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            {offer.redemptions} redeemed
                          </span>
                          <span className="text-[11px] md:text-[12px] 2xl:text-[14px] text-muted flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            {offer.saves} saved
                          </span>
                          <StatusBadge status={offer.status} />
                        </div>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" className={`w-4 h-4 text-muted flex-shrink-0 transition-transform ${expandedOffer === offer.id ? "rotate-180" : ""}`}>
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    {expandedOffer === offer.id && (
                      <div className="bg-gray-50">
                        <div className="flex items-center gap-8 pl-[92px] pr-4 py-3">
                          <button
                            onClick={() => router.push(`/dashboard/offers/edit?id=${offer.id}`)}
                            className="group flex items-center gap-2 text-[10px] md:text-[13px] text-[#F76715] font-medium"
                          >
                            <span className="w-6 h-6 rounded-lg bg-[#FEEFE6] flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#FDE3D3] group-hover:shadow-md">
                              <img src="/images/edit.png" alt="Edit" className="w-3 h-3 object-contain transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-[-12deg]" />
                            </span>
                            <span className="text-xs transition-colors duration-300 group-hover:text-[#D35400]">Edit</span>
                          </button>
                          <button
                            onClick={() => alert("Boost is coming soon!")}
                            className="group flex items-center gap-2 text-[10px] md:text-[13px] text-[#1750C4] font-medium"
                          >
                            <span className="w-6 h-6 rounded-lg bg-[#E7F1FD] flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                              <img src="/images/boost.png" alt="Boost" className="w-3 h-3 object-contain transition-transform duration-300 group-hover:scale-110" />
                            </span>
                            <span className="text-xs transition-colors duration-300 group-hover:text-[#0F3DA3]">Boost</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(offer)}
                            className="group flex items-center gap-2 text-[10px] md:text-[13px] text-[#ED0A3F] font-medium"
                          >
                            <span className="w-6 h-6 rounded-lg bg-[#FCE7E9] flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#FAD5DB]">
                              <img src="/images/delete.png" alt="Remove" className="w-3 h-3 object-contain transition-transform duration-300 group-hover:rotate-12" />
                            </span>
                            <span className="text-xs transition-colors duration-300 group-hover:text-red-700">Remove</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl p-4 md:p-5 2xl:p-8 shadow-sm">
          <h3 className="text-[16px] md:text-[18px] 2xl:text-[24px] font-bold text-dark mb-4">
            Recent Leads
          </h3>
          <div className="max-h-[420px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {recentLeads.length === 0 && (
              <p className="text-[13px] text-muted text-center py-8">No leads in the last 7 days.</p>
            )}
            {recentLeads.map((lead) => {
              const badgeStyles = {
                Viewed: "bg-blue-100 text-blue-700",
                Saved: "bg-amber-100 text-amber-700",
                Redeemed: "bg-green-100 text-green-700",
              };

              return (
                <div key={`${lead.id}-${lead.time}-${lead.action}`} className="flex items-start gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 2xl:w-12 2xl:h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-[13px] font-bold text-gray-500 overflow-hidden">
                    {lead.photo ? (
                      <img
                        src={lead.photo.startsWith("http") ? lead.photo : `${storageUrl}${lead.photo}`}
                        alt={lead.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      lead.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] md:text-[14px] 2xl:text-[16px] font-semibold text-dark truncate">
                        {lead.name}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-semibold whitespace-nowrap ${badgeStyles[lead.action as keyof typeof badgeStyles] || "bg-gray-100 text-gray-600"}`}>
                        {lead.action}
                      </span>
                    </div>
                    <p className="text-[11px] md:text-[12px] 2xl:text-[14px] text-muted mt-1 truncate">
                      {lead.discount} {lead.action}{" "}
                      <span className="text-[11px] md:text-[11px] text-[#5CB97C] mt-1">{lead.time}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-[380px] p-6 text-center shadow-xl">
            <h3 className="text-[18px] font-bold text-dark">Delete Offer</h3>
            <p className="text-[13px] text-muted mt-3">Are you sure you want to delete this offer?</p>
            <p className="text-[13px] text-red-500 font-medium mt-1">This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 h-10 rounded-xl bg-gray-100 text-dark font-semibold text-[13px] hover:bg-gray-200 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 h-10 rounded-xl bg-[#ED0A3F] text-white font-semibold text-[13px] hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}