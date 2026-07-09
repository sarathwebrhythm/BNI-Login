"use client";

import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Phone,
  Bookmark,
  Share2,
  ArrowRight,
} from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { PrivilegeCard } from "@/components/dashboard/PrivilegeCard";
import toast from "react-hot-toast";
import { toggleOfferSave, recordOfferRedemption } from "@/lib/api";
import type { Member } from "@/types";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });

export interface OfferModalData {
  id: number;
  discount: string;
  description?: string;
  category?: string;
  business_name?: string;
  business_address?: string;
  chapter?: string;
  image?: string;
  contact_number?: string;
  start_date?: string;
  end_date?: string;
  terms?: string[];
}

interface OfferDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferModalData | null;
  member: Member;
  isSaved?: boolean;
  onSaveToggle?: (offerId: number, saved: boolean) => void;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const modalWidth =
  "w-full max-w-[500px] md:max-w-[700px] xl:max-w-[500px] 2xl:max-w-[650px]";

export default function OfferDetailModal({
  isOpen,
  onClose,
  offer,
  member,
  isSaved = false,
  onSaveToggle,
}: OfferDetailModalProps) {
  const [showCard, setShowCard] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [redeemed, setRedeemed] = useState(false);

  const getToken = () =>
    localStorage.getItem("member_token") ||
    sessionStorage.getItem("member_token") ||
    "";

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  useEffect(() => {
    if (!offer) return;
    const redeemed_offers = JSON.parse(
      sessionStorage.getItem("redeemed_offers") || "[]",
    );
    setRedeemed(redeemed_offers.includes(offer.id));
  }, [offer]);

  const handleSave = () => {
    if (!offer) return;
    toggleOfferSave(offer.id, getToken())
      .then((res) => {
        if (res?.success) {
          setSaved(res.saved ?? !saved);
          onSaveToggle?.(offer.id, res.saved ?? !saved);
        }
      })
      .catch(() => {});
  };

  const handleRedeem = () => {
    if (!offer) return;
    const redeemed_offers = JSON.parse(
      sessionStorage.getItem("redeemed_offers") || "[]",
    );
    if (!redeemed_offers.includes(offer.id)) {
      recordOfferRedemption(offer.id, getToken()).catch(() => {});
      redeemed_offers.push(offer.id);
      sessionStorage.setItem(
        "redeemed_offers",
        JSON.stringify(redeemed_offers),
      );
    }
    toast.success(`You saved ${offer.discount} at ${offer.business_name}!`);
    window.dispatchEvent(new Event("stats-updated"));
    setRedeemed(true);
    setShowCard(false);
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setShowCard(false);
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showCard) setShowCard(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, showCard]);

  if (!isOpen || !offer) return null;

  /* ── Redeem / Privilege Card View ── */
  if (showCard) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2"
        onClick={() => setShowCard(false)}
      >
        <div
          className={`relative ${modalWidth} bg-white rounded-2xl overflow-hidden shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowCard(false)}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow hover:bg-white transition"
          >
            <X size={18} />
          </button>

          <div className="p-1 pb-0">
            <PrivilegeCard member={member} />
          </div>

          <div className="px-6 pt-5 pb-3">
            <h3 className="text-base font-bold text-dark mb-1">
              Show this to redeem
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              The brand will mark this redemption in their dashboard. Your
              savings will be tracked here.
            </p>
          </div>

          <div className="flex items-center gap-3 px-6 pb-6 pt-2">
            <button
              onClick={() => setShowCard(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRedeem}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition"
              style={{
                background:
                  "linear-gradient(90deg, rgba(193,20,43,1) 0%, rgba(110,9,20,1) 100%)",
              }}
            >
              Mark as Redeemed
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Offer Detail View ── */
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
  const imageUrl = offer.image
    ? offer.image.startsWith("http")
      ? offer.image
      : `${storageUrl}${offer.image}`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`relative ${modalWidth} rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow hover:bg-white transition"
        >
          <X size={18} />
        </button>

        {/* Header image */}
        <div className="relative h-70 2xl:h-90 bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={offer.business_name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <span className="text-6xl font-bold text-rose-200">
              {offer.business_name?.charAt(0).toUpperCase() ?? "B"}
            </span>
          )}
          <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg">
            {offer.discount}
          </span>
        </div>

        {/* Business info */}
        <div className="px-6 pt-5 pb-2">
          <p className="!text-2xs font-semibold uppercase tracking-wide !text-primary !mb-2">
            {offer.category || "Offer"}
          </p>
          <h2 className="text-xl font-bold text-dark leading-tight !mb-2">
            {offer.business_name || "Business Offer"}
          </h2>
          <p className="flex items-center gap-1.5 text-xs text-muted mt-1">
            <img
              src="/images/user new.png"
              alt=""
              className="h-3 w-3 flex-shrink-0 object-contain"
            />
            Offered by&nbsp;{offer.chapter || "Trivandrum"}&nbsp;Chapter Member
          </p>
        </div>

        {/* Discount banner */}
        {/* <div
          className="mx-6 my-4 flex items-center justify-between rounded-xl px-5 py-4 text-white"
          style={{ background: "linear-gradient(90deg, rgba(153,20,43,1) 0%, rgba(110,9,20,1) 100%)" }}
        >
          <div>
            <p className="!text-xs font-semibold uppercase tracking-wide !text-accent-yellow">
              Privilege Discount
            </p>
            <p className="text-sm !text-[#f4f4f4] font-medium tracking-wide !mt-0.5">
              Valid till {formatDate(offer.end_date)}
            </p>
          </div>
          <p className={`${playfair.className} !text-2xl !text-[#f4f4f4] font-bold whitespace-nowrap`}>
            {offer.discount}
          </p>
        </div> */}
        <div
          className="mx-6 my-4 flex flex-col gap-2 rounded-xl px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between"
          style={{
            background:
              "linear-gradient(90deg, rgba(153,20,43,1) 0%, rgba(110,9,20,1) 100%)",
          }}
        >
          <div>
            <p className="!text-xs font-semibold uppercase tracking-wide !text-accent-yellow">
              Privilege Discount
            </p>

            <p className="text-sm !text-[#f4f4f4] font-medium tracking-wide !mt-0.5">
              Valid till {formatDate(offer.end_date)}
            </p>
          </div>

          <p
            className={`${playfair.className} text-xl sm:!text-2xl !text-[#f4f4f4] font-bold self-start sm:self-auto whitespace-normal sm:whitespace-nowrap`}
          >
            {offer.discount}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 pb-4 space-y-5">
          {/* About */}
          {offer.description && (
            <div>
              <p className="!text-xs !text-primary font-semibold uppercase tracking-widest mb-1">
                About This Offer
              </p>
              <p className="!text-sm leading-relaxed text-gray-700 !mt-3">
                {offer.description}
              </p>
            </div>
          )}

          {/* Terms */}
          <div>
            <p className="!text-xs !text-primary font-semibold uppercase tracking-widest mb-1">
              Terms & Conditions
            </p>
            {offer.terms && offer.terms.length > 0 ? (
              <ul className="space-y-1.5 mt-3">
                {offer.terms.map((term, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                    {term}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="!text-sm text-gray-700 !mt-3">
                Terms and Conditions Apply.
              </p>
            )}
          </div>

          {/* Validity & Contact */}
          <div>
            <p className="!text-xs !text-primary font-semibold uppercase tracking-widest mb-1">
              Validity & Contact
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="rounded-lg bg-[#F6F4F1] px-3 py-2.5">
                <p className="!text-xs font-medium uppercase tracking-widest text-primary mb-1">
                  Address
                </p>
                <p className="flex items-start gap-1.5 !text-xs font-semibold text-gray-800 !mt-2">
                  <MapPin size={13} className="text-primary flex-shrink-0" />
                  {offer.business_address || "—"}
                </p>
              </div>
              <div className="rounded-lg bg-[#F6F4F1] px-3 py-2.5">
                <p className="!text-xs font-medium uppercase tracking-widest text-primary mb-1">
                  Valid From
                </p>
                <p className="flex items-center gap-1.5 !text-xs font-semibold text-gray-800 !mt-2">
                  <Calendar size={13} className="text-primary" />
                  {formatDate(offer.start_date)}
                </p>
              </div>
              <div className="rounded-lg bg-[#F6F4F1] px-3 py-2.5">
                <p className="!text-xs font-medium uppercase tracking-widest mb-1">
                  Valid Till
                </p>
                <p className="flex items-center gap-1.5 !text-xs font-semibold text-gray-800 !mt-2">
                  <Calendar size={13} className="text-primary" />
                  {formatDate(offer.end_date)}
                </p>
              </div>
              {offer.contact_number && (
                <div className="rounded-lg bg-[#F6F4F1] px-3 py-2.5">
                  <p className="!text-xs font-medium uppercase tracking-widest text-primary mb-1">
                    Contact
                  </p>
                  <p className="flex items-center gap-1.5 !text-xs font-semibold text-gray-800 !mt-2">
                    <Phone size={13} className="text-primary" />
                    {offer.contact_number}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            onClick={handleSave}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
              saved
                ? "bg-primary border-primary text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            <Share2 size={15} />
            Share
          </button>
          <button
            onClick={() => setShowCard(true)}
            className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-lg text-white px-3 py-2.5 text-sm font-semibold transition"
            style={{
              background:
                "linear-gradient(90deg, rgba(193,20,43,1) 0%, rgba(110,9,20,1) 100%)",
            }}
          >
            Show Card to Redeem
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
