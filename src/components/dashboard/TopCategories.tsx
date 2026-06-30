"use client";

import React, { useEffect, useState } from "react";
import { getOfferCategories } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  icon?: string;
}

export function TopCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token") ||
      "";
    getOfferCategories(token)
      .then((res) => {
        if (res.success && res.categories) {
          setCategories(res.categories);
        }
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
              <div className="w-14 h-14 rounded-full bg-gray-100 animate-pulse" />
              <div className="w-12 h-3 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div>
      <h2 className="text-[18px] font-bold text-dark mb-4">Top Categories</h2>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors overflow-hidden">
              {cat.icon ? (
                <img
                  src={
                    cat.icon.startsWith("http")
                      ? cat.icon
                      : `${process.env.NEXT_PUBLIC_STORAGE_URL}${cat.icon}`
                  }
                  alt={cat.name}
                  className="w-7 h-7 object-contain"
                />
              ) : (
                <span className="text-primary font-bold text-[18px]">
                  {cat.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-[12px] text-muted group-hover:text-dark transition-colors text-center leading-tight">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
