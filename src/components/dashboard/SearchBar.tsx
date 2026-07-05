"use client";

import React, { useEffect, useState } from "react";
import { getOfferCategories } from "@/lib/api";

interface Category {
  id: number;
  name: string;
}

interface SearchBarProps {
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  onSearch: (query: string) => void;
}

export function SearchBar({
  selectedCategory,
  onSelectCategory,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const token =
      localStorage.getItem("member_token") ||
      sessionStorage.getItem("member_token") ||
      "";
    getOfferCategories(token)
      .then((res) => {
        if (res.success && res.categories) setCategories(res.categories);
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  // Live search: debounce so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-white rounded-xl border border-gray-200 shadow-sm p-2"
    >
      {/* Search icon + input */}
      <div className="flex items-center gap-2 flex-1 min-w-0 px-2 ">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4 h-4 text-muted flex-shrink-0"
        >
          <circle
            cx="11"
            cy="11"
            r="8"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M21 21l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search offers..."
          className="flex-1 min-w-0 text-[13px] text-dark placeholder:text-muted outline-none bg-transparent h-[30px]"
        />
      </div>

      {/* Category dropdown + Search button (stacked row on mobile, inline on desktop) */}
      <div className="flex items-center gap-2 min-w-0 sm:contents">
        <div className="flex items-center gap-1 flex-1 min-w-0 sm:flex-initial bg-[#F3EEEA] sm:bg-transparent rounded-lg sm:rounded-none px-3 py-2 sm:p-0 sm:border-l sm:border-gray-200 sm:pl-3 sm:pr-2">
          <select
            value={selectedCategory ?? ""}
            onChange={(e) =>
              onSelectCategory(e.target.value ? Number(e.target.value) : null)
            }
            className="appearance-none flex-1 sm:flex-initial min-w-0 text-[13px] text-dark outline-none bg-transparent cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 text-muted flex-shrink-0"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Search button */}
        <button
          type="submit"
          className="shrink-0 bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
