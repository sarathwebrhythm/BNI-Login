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
import { Footer } from "@/components/dashboard/Footer";
import type { Member } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Scroll to a hash target (e.g. #offers-section) once the page content is ready
  useEffect(() => {
    if (!member) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  }, [member]);

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
              <div className="mb-6">
                <SearchBar
                  selectedCategory={selectedCategory}
                  onSelectCategory={(id) => setSelectedCategory(id)}
                  onSearch={(query) => setSearchQuery(query)}
                />
              </div>
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
                searchQuery={searchQuery}
              />
            </>
          } />
        </main>
        <Footer />
      </div>
    </div>
  );
}