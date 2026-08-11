"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Phone,
  Bookmark,
  Share2,
  ArrowRight,
  Copy,
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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const getToken = () =>
    localStorage.getItem("member_token") ||
    sessionStorage.getItem("member_token") ||
    "";

  //.........share button .....................
  const handleShare = () => {
    if (!offer) return;

    const message = `Check out this BNI offer:

${offer.business_name || "Business Offer"}
${offer.discount}

${offer.description || ""}

Valid: ${formatDate(offer.start_date)} – ${formatDate(offer.end_date)}

Please check the BNI app for more details. https://portal.bnitvm.com/`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
    setShowShareMenu(false);
  };
  const handleCopy = async () => {
    if (!offer) return;

    const message = `Check out this BNI offer:

${offer.business_name || "Business Offer"}
${offer.discount}

${offer.description || ""}

Valid: ${formatDate(offer.start_date)} – ${formatDate(offer.end_date)}

Please check the BNI app for more details. https://portal.bnitvm.com/`;

    await navigator.clipboard.writeText(message);

    toast.success("Offer text copied!");
    setShowShareMenu(false);
  };

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
      setShowShareMenu(false);
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showShareMenu) setShowShareMenu(false);
        else if (showCard) setShowCard(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, showCard, showShareMenu]);

  // Close the share dropdown when clicking outside it
  useEffect(() => {
    if (!showShareMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(e.target as Node)
      ) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShareMenu]);

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

          <div className="relative flex-1" ref={shareMenuRef}>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <Share2 size={15} />
              Share
            </button>

            {showShareMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg z-50 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Share Offer
                  </p>
                  <button
                    onClick={() => setShowShareMenu(false)}
                    aria-label="Close"
                    className="flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                  >
                    <X size={13} />
                  </button>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={handleShare}
                    className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-[#E7F7EE]"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#E7F7EE] transition-transform duration-200 group-hover:scale-105">
                      <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.821.487 3.53 1.338 5.003L2 22l5.117-1.317A9.955 9.955 0 0012.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.181c-1.634 0-3.15-.474-4.432-1.291l-.318-.19-3.05.786.821-2.977-.207-.318A8.163 8.163 0 013.819 12c0-4.518 3.664-8.181 8.182-8.181 4.517 0 8.181 3.663 8.181 8.181 0 4.518-3.664 8.181-8.181 8.181z" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                      Share on WhatsApp
                    </span>
                  </button>

                  <div className="my-1 h-px bg-gray-100" />

                  <button
                    onClick={handleCopy}
                    className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-gray-50"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#F6F4F1] text-primary transition-transform duration-200 group-hover:scale-105">
                      <Copy size={15} />
                    </span>
                    <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                      Copy Offer Text
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

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