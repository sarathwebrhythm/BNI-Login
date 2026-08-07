"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Footer } from "@/components/dashboard/Footer";
import type { Member } from "@/types";

interface Section {
  title: string;
  intro?: string;
  bullets?: string[];
  outro?: string;
}

const sections: Section[] = [
  {
    title: "1. Purpose",
    intro:
      "BNI Trivandrum enables its members to strengthen business relationships by sharing exclusive offers with fellow members. Members may publish offers and avail offers shared by other members, promoting business growth and collaboration within the BNI Trivandrum community.",
  },
  {
    title: "2. Eligibility",
    bullets: [
      "Access is limited to active and verified BNI Trivandrum members unless otherwise authorized by BNI Trivandrum.",
      "Members must provide accurate, complete, and up-to-date information.",
      "BNI Trivandrum reserves the right to suspend or terminate access if a member's status changes or these Terms and Conditions are violated.",
    ],
  },
  {
    title: "3. BNI Trivandrum Privilege Card",
    bullets: [
      "Every active BNI Trivandrum member is entitled to a BNI Trivandrum Privilege Card.",
      "Members may be required to present their BNI Trivandrum Privilege Card to verify their membership before availing any published offer.",
      "The Privilege Card is issued exclusively for the registered member and is non-transferable.",
      "Misuse, unauthorized sharing, or fraudulent use of the Privilege Card may result in suspension or termination of membership privileges.",
      "BNI Trivandrum reserves the right to modify, suspend, or discontinue the Privilege Card or its associated benefits at any time.",
    ],
  },
  {
    title: "4. Publishing Offers",
    intro:
      "Members may publish exclusive offers intended only for fellow BNI Trivandrum members. Members publishing offers agree that:",
    bullets: [
      "All offer details must be accurate, complete, and truthful.",
      "Offer validity, terms, conditions, and any applicable restrictions must be clearly stated.",
      "Offers must comply with all applicable laws and regulations.",
      "Members are solely responsible for honoring the offers they publish.",
      "BNI Trivandrum reserves the right to review, edit, reject, or remove any offer that is misleading, inappropriate, unlawful, or inconsistent with BNI values.",
    ],
  },
  {
    title: "5. Availing Offers",
    intro: "Members choosing to avail an offer acknowledge that:",
    bullets: [
      "They may be required to present their BNI Trivandrum Privilege Card to verify eligibility.",
      "They are responsible for reviewing all offer terms before availing the offer.",
      "Any transaction arising from an offer is solely between the participating members.",
      "BNI Trivandrum does not guarantee the availability, quality, pricing, fulfillment, or outcome of any offer.",
    ],
  },
  {
    title: "6. Member Responsibilities",
    intro: "Members agree to:",
    bullets: [
      "Conduct themselves professionally, ethically, and respectfully.",
      "Publish only genuine and lawful offers.",
      "Honor commitments made through published offers.",
      "Respect the rights and privacy of fellow members.",
      "Maintain the confidentiality of any information shared within BNI Trivandrum.",
      "Use BNI Trivandrum only for legitimate networking and business purposes.",
    ],
  },
  {
    title: "7. Prohibited Activities",
    intro: "Members shall not:",
    bullets: [
      "Publish false, misleading, deceptive, or fraudulent offers.",
      "Upload unlawful, offensive, defamatory, or inappropriate content.",
      "Misuse another member's information.",
      "Share or transfer their BNI Trivandrum Privilege Card to another person.",
      "Attempt to gain unauthorized access to BNI Trivandrum or interfere with its operation.",
      "Engage in any activity that may harm the reputation of BNI Trivandrum or its members.",
    ],
  },
  {
    title: "8. Member Transactions",
    intro:
      "All purchases, bookings, payments, services, or other transactions resulting from published offers are solely between the participating members. BNI Trivandrum does not act as a buyer, seller, agent, broker, or intermediary and shall not be responsible for:",
    bullets: [
      "Product or service quality.",
      "Pricing.",
      "Availability.",
      "Delivery.",
      "Payments.",
      "Refunds.",
      "Warranties.",
      "Disputes arising between members.",
    ],
  },
  {
    title: "9. Intellectual Property",
    intro:
      "Members retain ownership of the content they publish. By publishing an offer, members grant BNI Trivandrum a non-exclusive, royalty-free license to display, reproduce, and use the content for the administration and promotion of BNI Trivandrum.",
  },
  {
    title: "10. Privacy",
    intro:
      "Member information collected by BNI Trivandrum shall be used solely for membership administration, communication, and related activities. Members shall not use another member's information for unauthorized marketing, solicitation, or any purpose unrelated to BNI Trivandrum.",
  },
  {
    title: "11. Limitation of Liability",
    intro:
      "BNI Trivandrum serves solely as a facilitator for networking and member engagement. BNI Trivandrum shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:",
    bullets: [
      "Offers published by members.",
      "Transactions between members.",
      "Misrepresentation by any member.",
      "Failure of a member to honor an offer.",
      "Any loss or damage resulting from member interactions.",
    ],
  },
  {
    title: "12. Suspension or Termination",
    intro:
      "BNI Trivandrum reserves the right to suspend, restrict, or terminate a member's access without prior notice if the member:",
    bullets: [
      "Violates these Terms and Conditions.",
      "Misuses the BNI Trivandrum Privilege Card.",
      "Publishes misleading or unlawful offers.",
      "Engages in unethical conduct.",
      "Ceases to be an active BNI Trivandrum member.",
    ],
  },
  {
    title: "13. Amendments",
    intro:
      "BNI Trivandrum reserves the right to modify these Terms and Conditions at any time. Updated Terms and Conditions shall become effective upon publication. Continued use of BNI Trivandrum constitutes acceptance of the revised Terms.",
  },
  {
    title: "14. Governing Law",
    intro:
      "These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts in Thiruvananthapuram, Kerala.",
  },
  {
    title: "15. Acceptance",
    intro:
      "By using the services provided by BNI Trivandrum, you confirm that you have read, understood, and agreed to these Terms and Conditions.",
  },
];

export default function TermsAndConditionsPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const loadMember = () => {
      const token =
        localStorage.getItem("member_token") ||
        sessionStorage.getItem("member_token");
      const memberData =
        localStorage.getItem("member") || sessionStorage.getItem("member");
      if (!token) {
        router.push("/");
        return;
      }
      if (memberData) {
        setMember(JSON.parse(memberData));
      }
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
        <TopBar member={member} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl md:text-2xl 2xl:text-32 font-bold text-dark">
              Terms &amp; Conditions
            </h1>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm md:text-14 font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(193,20,43,1) 0%, rgba(110,9,20,1) 100%)",
                boxShadow: "0 1px 37px 0 rgba(251,12,12,0.4)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path
                  d="M19 12H5M5 12l7 7M5 12l7-7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back 
            </button>
          </div>

          <div>
            {/* Content card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 space-y-8">
              {/* Header */}
              <div>
                <p className="text-xl font-semibold uppercase tracking-wide text-primary mb-2">
                  BNI Trivandrum
                </p>
                <p className="text-base text-muted mt-2">
                  Effective Date: 10-7-2026
                </p>
                <p className="text-base leading-relaxed text-gray-700 mt-4">
                  Welcome to BNI Trivandrum. These Terms and Conditions govern
                  the use of the services, features, and member benefits
                  provided by BNI Trivandrum. By accessing or using BNI
                  Trivandrum, you acknowledge that you have read, understood,
                  and agree to be bound by these Terms and Conditions.
                </p>
              </div>

              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-base md:text-lg font-semibold text-dark mb-2">
                    {section.title}
                  </h2>
                  {section.intro && (
                    <p className="text-base leading-relaxed text-gray-700 mb-2">
                      {section.intro}
                    </p>
                  )}
                  {section.bullets && (
                    <ul className="space-y-1.5">
                      {section.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-base leading-relaxed text-gray-700"
                        >
                          <span className="text-primary mt-0.5 flex-shrink-0">
                            •
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.outro && (
                    <p className="text-sm leading-relaxed text-gray-700 mt-2">
                      {section.outro}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}