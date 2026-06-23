import React from "react";

const stats = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    label: "Total Savings",
    value: "₹ 28,450",

    positive: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    label: "Offers Redeemed",
    value: "12",

    positive: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 3v18M3 9h6M3 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Partner Brands",
    value: "180+",
   
    positive: true,
  },
];

export function StatsCards() {
  return (
    <div className="flex flex-col gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
            {stat.icon}
          </div>
          {/* Text */}
          <div className="flex-1">
            <p className="text-[12px] text-muted">{stat.label}</p>
            <p className="text-[20px] font-bold text-primary leading-tight">{stat.value}</p>
            <p className="text-[11px] text-muted">{stat.sub}</p>
          </div>
          {/* Change */}
          {stat.change && (
            <p className="text-[11px] text-green-500 font-medium whitespace-nowrap">
              {stat.change}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}