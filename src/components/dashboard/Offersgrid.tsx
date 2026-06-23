import React from "react";

const offers = [
  { name: "CliniCare", category: "Health & Wellness", location: "Trivandrum", rating: "4.8", discount: "20% OFF", bg: "from-blue-100 to-blue-50" },
  { name: "The South Park", category: "Travel", location: "Trivandrum", rating: "4.8", discount: "20% OFF", bg: "from-green-100 to-green-50" },
  { name: "Hyatt Regency", category: "Hotels", location: "Trivandrum", rating: "4.8", discount: "20% OFF", bg: "from-yellow-100 to-yellow-50" },
  { name: "Lifestyle Homes", category: "Interior", location: "Trivandrum", rating: "4.8", discount: "20% OFF", bg: "from-purple-100 to-purple-50" },
];

export function OffersGrid() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[12px] text-primary font-medium">Brand Offers · 180 Brands</p>
          <h2 className="text-[18px] font-bold text-dark">All This Month</h2>
        </div>
        <button className="flex items-center gap-1 text-[13px] text-primary font-semibold hover:opacity-80 transition-opacity">
          View All Offers
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {offers.map((offer, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
            {/* Image placeholder */}
            <div className={`relative h-36 bg-gradient-to-br ${offer.bg} flex items-center justify-center`}>
              {/* Discount badge */}
              <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {offer.discount}
              </span>
              {/* Wishlist */}
              <button className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-muted">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <span className="text-muted/30 text-xs">Image</span>
            </div>
            {/* Info */}
            <div className="p-3">
              <h3 className="text-[13px] font-semibold text-dark leading-tight">{offer.name}</h3>
              <p className="text-[11px] text-muted mt-0.5">{offer.category}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-muted">{offer.location}</p>
                <div className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-accent" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-[11px] font-semibold text-dark">{offer.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}