"use client";

import React, { useEffect, useState } from "react";
import {
  getAllActiveOffers,
  recordOfferView,
  toggleOfferSave,
} from "@/lib/api";
import OfferDetailModal, { OfferModalData } from "./OfferDetailModal";
import toast from "react-hot-toast";
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
  is_saved?: boolean;
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
  searchQuery?: string;
}

export function OffersGrid({
  selectedCategory,
  onClearCategory,
  member,
  searchQuery,
}: OffersGridProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<OfferModalData | null>(
    null,
  );
  const [savedOffers, setSavedOffers] = useState<Set<number>>(new Set());
  const [visibleCount, setVisibleCount] = useState(12);

  const getToken = () =>
    localStorage.getItem("member_token") ||
    sessionStorage.getItem("member_token") ||
    "";

  useEffect(() => {
    setLoading(true);
    getAllActiveOffers(
      getToken(),
      selectedCategory ?? undefined,
      searchQuery || undefined,
    )
      .then((res) => {
        if (res?.success && res.offers) {
          setOffers(res.offers);
          setVisibleCount(12);

          const saved = new Set<number>();

          res.offers.forEach((offer: any) => {
            if (offer.is_saved) {
              saved.add(offer.id);
            }
          });

          setSavedOffers(saved);
        } else {
          setOffers([]);
          setSavedOffers(new Set());
        }
      })
      .catch((err) => console.error("Failed to fetch offers:", err))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  const handleCardClick = (offer: Offer) => {
    const viewedOffers = JSON.parse(
      sessionStorage.getItem("viewed_offers") || "[]",
    );

    // Record only once per session
    if (!viewedOffers.includes(offer.id)) {
      recordOfferView(offer.id, getToken()).catch(() => {});

      viewedOffers.push(offer.id);

      sessionStorage.setItem("viewed_offers", JSON.stringify(viewedOffers));
    }

    setSelectedOffer(offer);
  };

  const handleSaveClick = (e: React.MouseEvent, offerId: number) => {
    e.stopPropagation(); // prevent card click
    const token = getToken();
    toggleOfferSave(offerId, token)
      .then((res) => {
        if (res?.success) {
          setSavedOffers((prev) => {
            const next = new Set(prev);
            if (res.saved) next.add(offerId);
            else next.delete(offerId);
            return next;
          });
          window.dispatchEvent(new Event("saved-offers-changed"));
          if (res.saved) {
            toast.success("Offer added to wishlist");
          } else {
            toast.error("Offer removed from wishlist");
          }
        }
      })
      .catch(() => {});
  };

  const Header = () => (
    <div className="flex items-center justify-between mb-2">
      <div>
        <p className="!text-sm 2xl:text-sm !text-primary font-medium">
          Brand Offers {!loading && `· ${offers.length} Offers`}
        </p>
        <h2 className="text-lg md:text-xl 2xl:text-2xl font-bold text-dark !mt-1">
          All This Month
        </h2>
      </div>
      {selectedCategory && (
        <button
          onClick={onClearCategory}
          className="flex items-center gap-1 text-xs md:text-sm 2xl:text-base text-primary font-semibold hover:opacity-80 transition-opacity"
        >
          View All Offers
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div id="offers-section">
        <Header />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 ">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse"
            >
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
      <div id="offers-section">
        <Header />
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-xs md:text-sm text-muted">
            No active offers in this category.
          </p>
        </div>
      </div>
    );
  }
  const visibleOffers = offers.slice(0, visibleCount);
  return (
    <div id="offers-section">
      <Header />
      <div className="grid grid-cols-2 min-[1025px]:grid-cols-4 gap-4 !mt-6 mb-12">
        {visibleOffers.map((offer, i) => {
          const imageUrl = offer.image
            ? offer.image.startsWith("http")
              ? offer.image
              : `${process.env.NEXT_PUBLIC_STORAGE_URL}${offer.image}`
            : null;
          const isSaved = savedOffers.has(offer.id);

          return (
            <div
              key={offer.id}
              onClick={() => handleCardClick(offer)}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div
                className={`relative h-36 2xl:h-50 bg-gradient-to-br ${bgColors[i % bgColors.length]} flex items-center justify-center overflow-hidden`}
              >
                <span className="absolute top-2 left-2 bg-primary text-white text-2xs md:text-xs font-bold px-2 py-0.5 rounded-md z-10">
                  {offer.discount}
                </span>
                {/* Save/Heart button */}
                <button
                  onClick={(e) => handleSaveClick(e, offer.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={isSaved ? "currentColor" : "none"}
                    className={`w-3.5 h-3.5 ${isSaved ? "text-primary" : "text-muted"}`}
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={offer.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-muted/30 text-2xs">No Image</span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-2xs md:text-xs 2xl:text-sm text-muted leading-tight truncate">
                  {offer.category || "—"}
                </h3>
                <p className="text-xs md:text-sm 2xl:text-base font-semibold text-dark mt-0.5 truncate">
                  {offer.business_name || "Offer"}
                </p>
                <p className="!text-xs md:text-xs 2xl:text-sm text-muted mt-0.5 line-clamp-2">
                  {offer.description || ""}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src="/images/user (1).png"
                      alt="chapter"
                      className="w-3 h-3"
                    />
                    <p className="!text-xs md:text-xs 2xl:text-sm text-muted truncate">
                      {offer.chapter || "Trivandrum"}
                    </p>
                  </div>
                  <button className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F7F2EF] cursor-pointer">
                    <img
                      src="/images/right-arrow (1).png"
                      alt="View"
                      className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {visibleCount < offers.length && (
        <div className="flex justify-center mb-12 -mt-6">
          <button
            onClick={() => setVisibleCount(offers.length)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-semibold text-dark hover:bg-gray-50 hover:border-primary/40 transition-colors shadow-sm"
          >
            View More ({offers.length - visibleCount} more)
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      <OfferDetailModal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
        member={member}
        isSaved={selectedOffer ? savedOffers.has(selectedOffer.id) : false}
        onSaveToggle={(offerId: number, saved: boolean) => {
          setSavedOffers((prev) => {
            const next = new Set(prev);
            if (saved) next.add(offerId);
            else next.delete(offerId);
            return next;
          });
          window.dispatchEvent(new Event("saved-offers-changed"));
        }}
      />
    </div>
  );
}
