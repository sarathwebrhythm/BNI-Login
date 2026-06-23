"use client";

import React, { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 shadow-sm p-2">
      {/* Search icon + input */}
      <div className="flex items-center gap-2 flex-1 px-2">
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-muted flex-shrink-0">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search offers, brands, categories ......"
          className="flex-1 text-[13px] text-dark placeholder:text-muted outline-none bg-transparent"
        />
      </div>

      {/* Category dropdown */}
      <div className="flex items-center gap-1 border-l border-gray-200 pl-3 pr-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-[13px] text-dark outline-none bg-transparent cursor-pointer"
        >
          <option>All Categories</option>
          <option>Shopping</option>
          <option>Automotive</option>
          <option>Travel</option>
          <option>Lifestyle</option>
          <option>Dining</option>
          <option>Education</option>
          <option>Health</option>
        </select>
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-muted">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Search button */}
      <button className="bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold px-5 py-2 rounded-lg transition-colors">
        Search
      </button>
    </div>
  );
}