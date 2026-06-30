"use client";

import React, { useEffect, useState } from "react";
import { getAllActiveOffers } from "@/lib/api";

interface Offer {
  id: number;
  title?: string;
  discount: string;
  description?: string;
  category?: string;
  business_name?: string;
  location?: string;
  image?: string;
}

const bgColors = [
  "from-blue-100 to-blue-50",
  "from-green-100 to-green-50",
  "from-yellow-100 to-yellow-50",
  "from-purple-100 to-purple-50",
  "from-pink-100 to-pink-50",
  "from-orange-100 to-orange-50",
];

export function OffersGrid() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("member_token") || sessionStorage.getItem("member_token") || "";
    getAllActiveOffers(token)
      .then((res) => {
        if (res.success && res.offers) {
          setOffers(res.offers);
        }
      })
      .catch((err) => console.error("Failed to fetch offers:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[12px] text-primary font-medium">Brand Offers</p>
            <h2 className="text-[18px] font-bold text-dark">All This Month</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
              <div className="h-36 bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[12px] text-primary font-medium">Brand Offers</p>
            <h2 className="text-[18px] font-bold text-dark">All This Month</h2>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-[13px] text-muted">No active offers available right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[12px] text-primary font-medium">Brand Offers · {offers.length} Offers</p>
          <h2 className="text-[18px] font-bold text-dark">All This Month</h2>
        </div>
        <button className="flex items-center gap-1 text-[13px] text-primary font-semibold hover:opacity-80 transition-opacity">
          View All Offers
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {offers.map((offer, i) => {
          const imageUrl = offer.image
            ? (offer.image.startsWith("http") ? offer.image : `${process.env.NEXT_PUBLIC_STORAGE_URL}${offer.image}`)
            : null;

          return (
            <div key={offer.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              {/* Image */}
              <div className={`relative h-36 bg-gradient-to-br ${bgColors[i % bgColors.length]} flex items-center justify-center overflow-hidden`}>
                <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
                  {offer.discount}
                </span>
                <button className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors z-10">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-muted">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                {imageUrl ? (
                  <img src={imageUrl} alt={offer.title || offer.business_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-muted/30 text-xs">No Image</span>
                )}
              </div>
              {/* Info */}
              <div className="p-3">
                <h3 className="text-[13px] font-semibold text-dark leading-tight truncate">{offer.business_name || offer.title || "Offer"}</h3>
                <p className="text-[11px] text-muted mt-0.5 truncate">{offer.category || "—"}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[11px] text-muted truncate">{offer.location || "Trivandrum"}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}