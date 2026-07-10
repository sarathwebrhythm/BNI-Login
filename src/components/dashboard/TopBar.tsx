"use client";

import { useEffect, useRef, useState } from "react";
import {
  getNotifications,
  getNotificationCount,
  markNotificationAsRead,
  getSavedOffers,
} from "@/lib/api";
import OfferDetailModal, { OfferModalData } from "./OfferDetailModal";
import type { Notification, Member } from "@/types";

function getToken() {
  return (
    localStorage.getItem("member_token") ||
    sessionStorage.getItem("member_token") ||
    ""
  );
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

interface SavedOffer {
  id: number;
  discount: string;
  business_name?: string;
  category?: string;
  image?: string;
}

interface TopBarProps {
  member: Member;
}

export function TopBar({ member }: TopBarProps) {
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Saved offers state
  const [savedOffers, setSavedOffers] = useState<SavedOffer[]>([]);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [savedLoading, setSavedLoading] = useState(false);
  const savedRef = useRef<HTMLDivElement>(null);
  const [selectedOffer, setSelectedOffer] = useState<OfferModalData | null>(
    null,
  );

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

  // Fetch unread notification count on mount, then poll
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchCount = () => {
      getNotificationCount(token)
        .then((res) => {
          if (res?.success) setUnreadCount(res.count);
        })
        .catch(() => {});
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch saved offers on mount so the badge count is correct immediately
  // (not just after the dropdown is opened)
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    getSavedOffers(token)
      .then((res) => {
        if (res?.success && res.offers) setSavedOffers(res.offers);
      })
      .catch(() => {});
  }, []);

  // Re-fetch saved offers whenever a save/unsave happens anywhere else in the
  // app (e.g. OffersGrid heart button, OfferDetailModal save button), so the
  // badge count stays live without needing a page refresh.
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const handleSavedOffersChanged = () => {
      getSavedOffers(token)
        .then((res) => {
          if (res?.success && res.offers) setSavedOffers(res.offers);
        })
        .catch(() => {});
    };

    window.addEventListener("saved-offers-changed", handleSavedOffersChanged);
    return () =>
      window.removeEventListener("saved-offers-changed", handleSavedOffersChanged);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setIsNotifOpen(false);
      }
      if (
        savedRef.current &&
        !savedRef.current.contains(e.target as Node)
      ) {
        setIsSavedOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    const next = !isNotifOpen;
    setIsNotifOpen(next);
    setIsSavedOpen(false);

    if (next) {
      setNotifLoading(true);
      getNotifications(getToken())
        .then((res) => {
          if (res?.success) setNotifications(res.notifications);
        })
        .catch(() => {})
        .finally(() => setNotifLoading(false));
    }
  };

  const handleHeartClick = () => {
    const next = !isSavedOpen;
    setIsSavedOpen(next);
    setIsNotifOpen(false);

    if (next) {
      setSavedLoading(true);
      getSavedOffers(getToken())
        .then((res) => {
          if (res?.success && res.offers) setSavedOffers(res.offers);
        })
        .catch(() => {})
        .finally(() => setSavedLoading(false));
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.is_read) return;

    const token = getToken();
    markNotificationAsRead(notification.id, token)
      .then((res) => {
        if (res?.success) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, is_read: true } : n,
            ),
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      })
      .catch(() => {});
  };

  return (
    // <div className=" fixed-top flex justify-end items-center gap-2 px-3 py-2 bg-white border-b border-gray-100 relative">
    <div className="sticky top-0 z-40 flex justify-end items-center gap-2 px-3 py-2 bg-white border-b border-gray-100">
      {/* Saved offers (heart) */}
      <div className="relative" ref={savedRef}>
        <button
          onClick={handleHeartClick}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#F3F3F3] hover:bg-[#EAEAEA] transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill={savedOffers.length > 0 ? "currentColor" : "none"}
            className="w-5 h-5 text-[#9B9B9B]"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>

          {savedOffers.length > 0 && (
            <span className="absolute top-1 right-0 min-w-[12px] h-3 px-[3px] rounded-full bg-primary text-white text-2xs flex items-center justify-center">
              {savedOffers.length > 9 ? "9+" : savedOffers.length}
            </span>
          )}
        </button>

        {isSavedOpen && (
          <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-dark">Saved Offers</p>
              {savedOffers.length > 0 && (
                <span className="text-2xs font-semibold text-primary">
                  {savedOffers.length} saved
                </span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {savedLoading && (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-2 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!savedLoading && savedOffers.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-xs text-muted">
                    No saved offers yet. Tap the heart on any offer to save it.
                  </p>
                </div>
              )}

              {!savedLoading &&
                savedOffers.map((offer) => {
                  const imageUrl = offer.image
                    ? offer.image.startsWith("http")
                      ? offer.image
                      : `${storageUrl}${offer.image}`
                    : null;

                  return (
                    <button
                      key={offer.id}
                      onClick={() => {
                        setSelectedOffer(offer as OfferModalData);
                        setIsSavedOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors flex gap-3"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={offer.business_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-dark truncate">
                          {offer.business_name || "Offer"}
                        </p>
                        <p className="text-xs text-muted mt-0.5 truncate">
                          {offer.category || "—"}
                        </p>
                        <p className="text-2xs font-semibold text-primary mt-1">
                          {offer.discount}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Notifications (bell) */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={handleBellClick}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#F3F3F3] hover:bg-[#EAEAEA] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#9B9B9B]">
            <path
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {unreadCount > 0 && (
            <span className="absolute top-1 right-0 min-w-[12px] h-3 px-[3px] rounded-full bg-[#D11A2A] text-white text-2xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {isNotifOpen && (
          <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-dark">Notifications</p>
              {unreadCount > 0 && (
                <span className="text-2xs font-semibold text-primary">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifLoading && (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {!notifLoading && notifications.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-xs text-muted">No notifications yet.</p>
                </div>
              )}

              {!notifLoading &&
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors flex gap-3 ${
                      !notification.is_read ? "bg-red-50/40" : ""
                    }`}
                  >
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        notification.is_read ? "bg-transparent" : "bg-primary"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-dark truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-2xs text-muted/70 mt-1">
                        {timeAgo(notification.created_at)}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      <OfferDetailModal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
        member={member}
        isSaved={true}
        onSaveToggle={(offerId: number, saved: boolean) => {
          if (!saved) {
            setSavedOffers((prev) => prev.filter((o) => o.id !== offerId));
          }
          window.dispatchEvent(new Event("saved-offers-changed"));
        }}
      />
    </div>
  );
}