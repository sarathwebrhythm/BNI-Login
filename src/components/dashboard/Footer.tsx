import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#1A1A1A] text-center py-6 px-4">
      <p className="!text-[#aaaaaa] text-sm">
        BNI Trivandrum Privilege Card · Powered by Webrhythm  · 23 Chapters · 1050+ Members
      </p>
      <p className="!text-[#aaaaaa] text-sm mt-2">
        © {new Date().getFullYear()} BNI Trivandrum. All rights reserved ·{" "}
        <Link href="/terms-and-conditions" className="!text-accent-yellow hover:underline">
          Terms &amp; Conditions
        </Link>
      </p>
    </footer>
  );
}