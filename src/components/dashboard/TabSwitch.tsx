"use client";

import { useState } from "react";
import Image from "next/image";
import { BusinessDashboard } from "./BusinessDashboard";
import type { Member } from "@/types";

const tabs = [
  { label: "User", icon: "/images/Group 3.png" },
  { label: "Business", icon: "/images/Group 4.png" },
];

interface TabSwitchProps {
  userContent: React.ReactNode;
  member: Member;
}

export function TabSwitch({ userContent, member }: TabSwitchProps) {
  const [active, setActive] = useState("User");

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="flex items-center bg-white rounded-2xl p-1 shadow-sm gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActive(tab.label)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                active === tab.label ? "bg-primary text-white" : "text-muted hover:bg-gray-50"
              }`}
            >
              <Image src={tab.icon} alt={tab.label} width={18} height={18} className="w-4 h-4 object-contain" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {active === "User" ? userContent : <BusinessDashboard member={member} />}
    </div>
  );
}