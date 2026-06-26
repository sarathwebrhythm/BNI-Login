"use client";

import React, { useState } from "react";
import { BusinessHero } from "@/components/business/BusinessHero";
import type { Member } from "@/types";

interface BusinessDashboardProps {
  member: Member;
}

const activeOffers = [
  { id: 1, title: "20% Off on All Dine-in", date: "30 Jun 2024", views: "8,640", redemptions: "1,628", status: "Active" },
  { id: 2, title: "10% Off on Weekend Buffet", date: "30 Jun 2024", views: "8,640", redemptions: "1,628", status: "Active" },
  { id: 3, title: "10% Off on Breakfast", date: "30 Jun 2024", views: "8,640", redemptions: "1,628", status: "Active" },
];

const recentLeads = [
  { id: 1, name: "Arun Menon", detail: "Interested in 20% Dine-in Offer", status: "New" },
  { id: 2, name: "Sneha Rajeev", detail: "Enquired about Weekend Buffet", status: "New" },
  { id: 3, name: "Vishnu Nair", detail: "Enquired about Weekend Buffet", status: "Follow up" },
  { id: 4, name: "Anand Krishnan", detail: "Interested in Catering Services", status: "Follow up" },
  { id: 5, name: "Ram Varma", detail: "Enquired about Weekend Buffet", status: "New" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "New": "bg-green-100 text-green-600",
    "Follow up": "bg-red-100 text-red-500",
    "Active": "bg-green-100 text-green-600",
  };
  return (
    <span className={`text-[11px] md:text-[12px] 2xl:text-[14px] font-semibold px-2 py-0.5 rounded-full ${styles[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

export function BusinessDashboard({ member }: BusinessDashboardProps) {
  const [expandedOffer, setExpandedOffer] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <BusinessHero member={member} />

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] 2xl:grid-cols-[1fr_480px] gap-6">

        {/* Active Offers */}
        <div className="bg-white rounded-2xl p-4 md:p-5 2xl:p-8 shadow-sm">
          <h3 className="text-[16px] md:text-[18px] 2xl:text-[24px] font-bold text-dark mb-4">
            Active Offers ({activeOffers.length})
          </h3>
          <div className="space-y-3">
            {activeOffers.map((offer) => (
              <div key={offer.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOffer(expandedOffer === offer.id ? null : offer.id)}
                >
                  {/* Offer image placeholder */}
                  <div className="w-16 h-14 2xl:w-20 2xl:h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] md:text-[14px] 2xl:text-[18px] font-semibold text-dark">{offer.title}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-[11px] md:text-[12px] 2xl:text-[14px] text-muted flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 2xl:w-4 2xl:h-4">
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {offer.date}
                      </span>
                      <span className="text-[11px] md:text-[12px] 2xl:text-[14px] text-muted flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 2xl:w-4 2xl:h-4">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        {offer.views}
                      </span>
                      <span className="text-[11px] md:text-[12px] 2xl:text-[14px] text-primary font-semibold flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 2xl:w-4 2xl:h-4">
                          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7.5M17 13l1.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {offer.redemptions}
                      </span>
                      <StatusBadge status={offer.status} />
                    </div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" className={`w-4 h-4 2xl:w-5 2xl:h-5 text-muted flex-shrink-0 transition-transform ${expandedOffer === offer.id ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                {expandedOffer === offer.id && (
                  <div className="flex items-center gap-6 px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <button className="flex items-center gap-1.5 text-[12px] md:text-[13px] 2xl:text-[15px] text-primary font-medium hover:opacity-75 transition-opacity">
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 2xl:w-4 2xl:h-4">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Edit
                    </button>
                    <button className="flex items-center gap-1.5 text-[12px] md:text-[13px] 2xl:text-[15px] text-yellow-600 font-medium hover:opacity-75 transition-opacity">
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 2xl:w-4 2xl:h-4">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Boost
                    </button>
                    <button className="flex items-center gap-1.5 text-[12px] md:text-[13px] 2xl:text-[15px] text-red-500 font-medium hover:opacity-75 transition-opacity">
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 2xl:w-4 2xl:h-4">
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl p-4 md:p-5 2xl:p-8 shadow-sm">
          <h3 className="text-[16px] md:text-[18px] 2xl:text-[24px] font-bold text-dark mb-4">Recent Leads</h3>
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 2xl:w-12 2xl:h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-[13px] md:text-[14px] 2xl:text-[16px] font-bold text-gray-500">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] md:text-[14px] 2xl:text-[16px] font-semibold text-dark">{lead.name}</p>
                  <p className="text-[11px] md:text-[12px] 2xl:text-[14px] text-muted truncate">{lead.detail}</p>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}