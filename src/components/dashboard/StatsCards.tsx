"use client";

import React, { useEffect, useState } from "react";

interface Stats {
  active_offers: number;
  redeemed_count: number;
  total_partners: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    active_offers: 0,
    redeemed_count: 0,
    total_partners: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    const token = localStorage.getItem("member_token") || sessionStorage.getItem("member_token") || "";
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/member/member-stats`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats({
            active_offers: data.active_offers,
            redeemed_count: data.redeemed_count,
            total_partners: data.total_partners,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
    window.addEventListener("stats-updated", fetchStats);
    return () => window.removeEventListener("stats-updated", fetchStats);
  }, []);

  const cards = [
    {
      icon: "/images/vector-40.png",
      label: "Total Active Offers",
      value: loading ? "..." : stats.active_offers.toString(),
    },
    {
      icon: "/images/vector-41.png",
      label: "Offers Redeemed",
      value: loading ? "..." : stats.redeemed_count.toString(),
    },
    {
      icon: "/images/vector-42.png",
      label: "Total Partners",
      value: loading ? "..." : `${stats.total_partners}+`,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {cards.map((stat, i) => (
        <div
          key={i}
          className="group flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
            <img src={stat.icon} alt={stat.label} className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300" />
          </div>
          {/* Text */}
          <div className="flex-1">
            <p className="text-base !text-bold">{stat.label}</p>
            <p className="text-xl font-bold text-primary leading-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}