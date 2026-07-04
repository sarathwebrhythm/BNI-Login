"use client";

import React, { useEffect, useState } from "react";
import { getOfferCategories } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  icon?: string;
}

interface TopCategoriesProps {
  onSelectCategory: (categoryId: number | null) => void;
  selectedCategory: number | null;
}

export function TopCategories({ onSelectCategory, selectedCategory }: TopCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("member_token") || sessionStorage.getItem("member_token") || "";
    getOfferCategories(token)
      .then((res) => {
        if (res.success && res.categories) setCategories(res.categories);
      })
      .catch((err) => console.error("Failed to fetch categories:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-[18px] font-bold text-dark mb-4">Top Categories</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14    rounded-full bg-gray-100 animate-pulse" />
              <div className="w-12 h-3 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  const visibleCategories = showAll ? categories : categories.slice(0, 7);

  return (
    <div id="top-categories">
      <h2 className="text-[18px] font-bold text-dark mb-4">Top Categories</h2>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {visibleCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-14 h-14 2xl:w-18 2xl:h-18 rounded-full border-4 !border-[#fafafa] flex items-center justify-center transition-colors overflow-hidden ${
                isSelected ? "bg-primary" : "bg-primary/8 group-hover:bg-primary/15"
              }`}>
                {cat.icon ? (
                  <img
                    src={cat.icon.startsWith("http") ? cat.icon : `${process.env.NEXT_PUBLIC_STORAGE_URL}${cat.icon}`}
                    alt={cat.name}
                    className={`w-7 h-7 object-contain ${isSelected ? "brightness-0 invert" : ""}`}
                  />
                ) : (
                  <span className={`font-bold text-[18px] ${isSelected ? "text-white" : "text-primary"}`}>
                    {cat.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className={`text-[12px] 2xl:text-[14px] transition-colors text-center leading-tight ${
                isSelected ? "text-primary font-semibold" : "text-muted group-hover:text-dark"
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}

        {/* More / Less button */}
        {categories.length > 7 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 2xl:w-18 2xl:h-18 rounded-full border-4 !border-[#fafafa] bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              {showAll ? (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary">
                  <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary">
                  <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="19" cy="12" r="1.5" fill="currentColor" />
                </svg>
              )}
            </div>
            <span className="text-[12px] text-muted group-hover:text-dark transition-colors text-center leading-tight">
              {showAll ? "Less" : "More"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}