"use client";

import React, { useEffect, useState } from "react";
import { getAllActiveOffers } from "@/lib/api";
import OfferDetailModal, { OfferModalData } from "./OfferDetailModal";
import type { Member } from "@/types";

interface Offer {
  id: number;
  discount: string;
  description?: string;
  category?: string;
  category_id?: number;
  business_name?: string;
  chapter?: string;
  image?: string;
  contact_number?: string;
  start_date?: string;
  end_date?: string;
  terms?: string[];
}

const bgColors = [
  "from-blue-100 to-blue-50",
  "from-green-100 to-green-50",
  "from-yellow-100 to-yellow-50",
  "from-purple-100 to-purple-50",
  "from-pink-100 to-pink-50",
  "from-orange-100 to-orange-50",
];

interface OffersGridProps {
  selectedCategory: number | null;
  onClearCategory: () => void;
  member: Member;
}

export function OffersGrid({ selectedCategory, onClearCategory, member }: OffersGridProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<OfferModalData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("member_token") || sessionStorage.getItem("member_token") || "";
    setLoading(true);
    getAllActiveOffers(token, selectedCategory ?? undefined)
      .then((res) => {
        if (res.success && res.offers) setOffers(res.offers);
        else setOffers([]);
      })
      .catch((err) => console.error("Failed to fetch offers:", err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const Header = () => (
    <div className="flex items-center justify-between mb-2">
      <div>
        <p className="text-2xs md:text-xs 2xl:text-sm text-primary font-medium">
          Brand Offers {!loading && `· ${offers.length} Offers`}
        </p>
        <h2 className="text-lg md:text-xl 2xl:text-2xl font-bold text-dark">All This Month</h2>
      </div>
      {selectedCategory && (
        <button onClick={onClearCategory} className="flex items-center gap-1 text-xs md:text-sm 2xl:text-base text-primary font-semibold hover:opacity-80 transition-opacity">
          View All Offers
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div>
        <Header />
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
        <Header />
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-xs md:text-sm text-muted">No active offers in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {offers.map((offer, i) => {
          const imageUrl = offer.image
            ? offer.image.startsWith("http") ? offer.image : `${process.env.NEXT_PUBLIC_STORAGE_URL}${offer.image}`
            : null;

          return (
            <div
              key={offer.id}
              onClick={() => setSelectedOffer(offer)}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className={`relative h-36 bg-gradient-to-br ${bgColors[i % bgColors.length]} flex items-center justify-center overflow-hidden`}>
                <span className="absolute top-2 left-2 bg-primary text-white text-2xs md:text-xs font-bold px-2 py-0.5 rounded-md z-10">
                  {offer.discount}
                </span>
                <button className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors z-10">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-muted">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                {imageUrl ? (
                  <img src={imageUrl} alt={offer.business_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-muted/30 text-2xs">No Image</span>
                )}
              </div>
              <div className="p-3">
                {/* Category */}
                <h3 className="text-2xs md:text-xs 2xl:text-sm text-muted leading-tight truncate">
                  {offer.category || "—"}
                </h3>
                {/* Business name */}
                <p className="text-xs md:text-sm 2xl:text-base font-semibold text-dark mt-0.5 truncate">
                  {offer.business_name || "Offer"}
                </p>
                {/* Description */}
                <p className="!text-xs md:text-xs 2xl:text-sm text-muted mt-0.5 line-clamp-2">
                  {offer.description || ""}
                </p>
                {/* Footer */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src="/images/user (1).png" alt="chapter" className="w-3 h-3" />
                    <p className="!text-xs md:text-xs 2xl:text-sm text-muted truncate">
                      {offer.chapter || "Trivandrum"}
                    </p>
                  </div>
                  <button className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F7F2EF] cursor-pointer">
                    <img src="/images/right-arrow (1).png" alt="View" className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <OfferDetailModal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
        member={member}
      />
    </div>
  );
}