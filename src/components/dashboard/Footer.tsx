export function Footer() {
  return (
    <footer className="w-full bg-[#1A1A1A] text-center py-6 px-4">
      <p className="!text-[#aaaaaa] text-sm">
        BNI Trivandrum Privilege Card · Powered by BNI Trivandrum Region · 21 Chapters · 960+ Members
      </p>
      <p className="!text-[#aaaaaa] text-sm mt-2">
        © {new Date().getFullYear()} BNI Trivandrum. All rights reserved ·{" "}
        <a href="#" className="!text-accent-yellow hover:underline">Terms</a> ·{" "}
        <a href="#" className="!text-accent-yellow hover:underline">Privacy</a>
      </p>
    </footer>
  );
}
