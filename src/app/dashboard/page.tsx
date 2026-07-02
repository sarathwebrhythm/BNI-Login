"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { PrivilegeCard } from "@/components/dashboard/PrivilegeCard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { TopCategories } from "@/components/dashboard/TopCategories";
import { OffersGrid } from "@/components/dashboard/OffersGrids";
import { TabSwitch } from "@/components/dashboard/TabSwitch";
import type { Member } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const loadMember = () => {
      const token = localStorage.getItem("member_token") || sessionStorage.getItem("member_token");
      const memberData = localStorage.getItem("member") || sessionStorage.getItem("member");
      if (!token) { router.push("/"); return; }
      if (memberData) { setMember(JSON.parse(memberData)); }
    };

    loadMember();
    window.addEventListener("focus", loadMember);
    return () => window.removeEventListener("focus", loadMember);
  }, [router]);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar member={member} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-2 md:p-4 xl:p-6 2xl:p-12">
          <TabSwitch member={member} userContent={
            <>
              <div className="grid grid-cols-1 xl:grid-cols-[500px_1fr] 2xl:grid-cols-[650px_500px] gap-6 mb-6">
                <PrivilegeCard member={member} />
                <StatsCards />
              </div>
              <div className="mb-6"><SearchBar /></div>
              <div className="mb-6">
                <TopCategories
                  selectedCategory={selectedCategory}
                  onSelectCategory={(id) => setSelectedCategory(id === selectedCategory ? null : id)}
                />
              </div>
              <OffersGrid
                selectedCategory={selectedCategory}
                onClearCategory={() => setSelectedCategory(null)}
                member={member}
              />
            </>
          } />
        </main>
      </div>
    </div>
  );
}