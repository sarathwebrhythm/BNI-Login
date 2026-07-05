import React from "react";
import Image from "next/image";
import type { Member } from "@/types";

interface PrivilegeCardProps {
  member: Member;
}

function formatCardDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${month} / ${year}`;
}

export function PrivilegeCard({ member }: PrivilegeCardProps) {
  return (
    <div id="privilege-card"
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ aspectRatio: "600/333" }}
    >
      <Image src="/images/card.png" alt="Privilege Card" fill className="object-cover object-center" priority />
      <div className="absolute privilage-card inset-0 flex flex-col justify-between px-7 pt-5 pb-5">
        <div>
          <Image src="/images/Union.png" alt="BNI Trivandrum" width={80} height={40} className="object-contain object-left w-[30px] md:w-[90px] xl:w-[50px] 2xl:w-[80px]" />
        
        
          <h2 className="card-name mt-2 card-gradient-text font-bold">{member.name}</h2>
<div className="w-18 mt-2 h-[1.5px] my-1.5 bg-[linear-gradient(90deg,_#FFFCED_3.85%,_#F2E3BC_23.88%,_#FFBD76_100%)]" />
          <p className="card-chapter tracking-[0.3em] uppercase !text-[#e5e5e5]">{member.chapter || "TRIVANDRUM CHAPTER"}</p>
          <p className="card-designation card-gradient-text font-bold tracking-[0.12em] uppercase mt-0.5">{member.designation || "MEMBER"}</p>
    
          <div className="card-dashed-border mt-4 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg">
            <Image src="/images/Vector-5.png" alt="Member" width={50} height={50} className="w-4 h-4 md:w-7 md:h-7 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 object-contain flex-shrink-0" />
            <div className="w-px h-6 flex-shrink-0" style={{ background: "rgba(246,246,246,0.4)" }} />
            <div>
              <p className="card-id-label tracking-[0.12em] uppercase leading-none" style={{ color: "#e5e5e5" }}>BNI ID</p>
              <p className="card-id-value tracking-[0.1em] !leading-tight" style={{ color: "#f4f4f4" }}>{member.bni_id}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Image src="/images/Group 1.png" alt="Valid Through" width={10} height={10} className="w-3.5 h-3.5 md:w-5 md:h-5 xl:w-4 xl:h-4 2xl:w-6 2xl:h-6 object-contain flex-shrink-0" />
            <div>
              <p className="card-meta-label tracking-[0.15em] uppercase" style={{ color: "#f4f4f4" }}>VALID THROUGH</p>
              <p className="card-meta-value tracking-[0.06em]" style={{ color: "#f4f4f4" }}>{formatCardDate(member.expire_date)}</p>
            </div>
          </div>
          <div className="w-px h-5" style={{ background: "rgba(201,168,76,0.3)" }} />
          <div className="flex items-center gap-1.5">
            <Image src="/images/Group 2.png" alt="Member Since" width={10} height={10} className="w-3.5 h-3.5 md:w-5 md:h-5 xl:w-4 xl:h-4 2xl:w-6 2xl:h-6 object-contain flex-shrink-0" />
            <div>
              <p className="card-meta-label tracking-[0.15em] uppercase" style={{ color: "#f4f4f4" }}>MEMBER SINCE</p>
              <p className="card-meta-value tracking-[0.06em]" style={{ color: "#f4f4f4" }}>{formatCardDate(member.joining_date)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}