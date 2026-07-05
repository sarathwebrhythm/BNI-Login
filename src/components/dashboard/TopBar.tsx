"use client";

export function TopBar() {
  return (
    <div className="flex justify-end px-3 py-2 bg-white border-b border-gray-100">
<button className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#F3F3F3]">
  {/* Bell Icon */}
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5 text-[#9B9B9B]"
  >
    <path
      d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

  {/* Notification Badge */}
  <span className="absolute top-1 right-0 w-3 h-3 rounded-full bg-[#D11A2A] text-white text-sm  flex items-center justify-center">
    3
  </span>
</button>
    </div>
  );
}