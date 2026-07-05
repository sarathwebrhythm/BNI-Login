const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  member?: {
    id: number;
    bni_id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    chapter?: string;
    designation?: string;
    profile_photo?: string;
    cover_photo?: string;
    business_logo?: string;
  };
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  photo_url?: string;
  cover_url?: string;
  logo_url?: string;
  categories?: { id: number; name: string; icon?: string }[];
  offers?: any[];
  offer?: any;
  saved?: boolean;
  views?: number;
  redemptions?: number;
  saves?: number;
  redemption_rate?: number;
  leads?: any[];
  active_offers?: number;
  redeemed_count?: number;
  total_partners?: number;
}

// ============================================================
// 401 interceptor — clears storage and redirects to login
// ============================================================
function handleUnauthorized() {
  localStorage.removeItem("member_token");
  localStorage.removeItem("member");
  sessionStorage.removeItem("member_token");
  sessionStorage.removeItem("member");
  window.location.href = "/";
}

async function apiFetch(url: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(url, options);
  if (res.status === 401) {
    handleUnauthorized();
    return null;
  }
  return res.json();
}

// ============================================================
// Auth — no interceptor needed (public routes)
// ============================================================
export async function loginMember(
  email: string,
  password: string,
  type: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/member/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password, type }),
  });
  return res.json();
}

export async function forgotPassword(email: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/member/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function verifyOtp(email: string, otp: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/member/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
}

export async function resetPassword(
  email: string,
  password: string,
  password_confirmation: string
): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/member/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password, password_confirmation }),
  });
  return res.json();
}

// ============================================================
// Protected routes — all use apiFetch with 401 interceptor
// ============================================================
export async function uploadProfilePhoto(file: File, token: string): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("photo", file);
  return apiFetch(`${API_BASE_URL}/member/update-profile-photo`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
}

export async function uploadCoverPhoto(file: File, token: string): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("cover", file);
  return apiFetch(`${API_BASE_URL}/member/update-cover-photo`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
}

export async function uploadBusinessLogo(file: File, token: string): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("logo", file);
  return apiFetch(`${API_BASE_URL}/member/update-business-logo`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
}

// Get offer categories
export async function getOfferCategories(token: string): Promise<ApiResponse> {
  return apiFetch(`${API_BASE_URL}/member/offer-categories`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
}

// Create offer
export async function createOffer(formData: FormData, token: string): Promise<ApiResponse> {
  return apiFetch(`${API_BASE_URL}/member/offers`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
}

// Get member offers (logged-in member's own offers)
export async function getMemberOffers(token: string): Promise<ApiResponse> {
  return apiFetch(`${API_BASE_URL}/member/offers`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
}

// Get all active offers (public feed, from all members)
export async function getAllActiveOffers(token: string, categoryId?: number, search?: string): Promise<ApiResponse> {
  const params = new URLSearchParams();
  if (categoryId) params.set("category_id", String(categoryId));
  if (search) params.set("search", search);
  const query = params.toString();
  const url = `${API_BASE_URL}/member/all-offers${query ? `?${query}` : ""}`;
  return apiFetch(url, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
}

// Delete offer
export async function deleteOffer(id: number, token: string): Promise<ApiResponse> {
  return apiFetch(`${API_BASE_URL}/member/offers/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
}

// Update offer
export async function updateOffer(id: number, formData: FormData, token: string): Promise<ApiResponse> {
  formData.append("_method", "PUT");
  return apiFetch(`${API_BASE_URL}/member/offers/${id}`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
}

// Get recent leads
export async function getRecentLeads(token: string): Promise<ApiResponse> {
  return apiFetch(`${API_BASE_URL}/member/recent-leads`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
}

// Get member stats
export async function getMemberStats(token: string): Promise<ApiResponse> {
  return apiFetch(`${API_BASE_URL}/member/member-stats`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
}

// ============================================================
// Offer Stats
// ============================================================

// Record a view
export async function recordOfferView(offerId: number, token: string): Promise<ApiResponse> {
  return apiFetch(`${API_BASE_URL}/member/offers/${offerId}/view`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
}

// Record a redemption
export async function recordOfferRedemption(offerId: number, token: string): Promise<ApiResponse> {
  return apiFetch(`${API_BASE_URL}/member/offers/${offerId}/redeem`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
}

// Toggle save (save/unsave)
export async function toggleOfferSave(offerId: number, token: string): Promise<ApiResponse> {
  return apiFetch(`${API_BASE_URL}/member/offers/${offerId}/save`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
}

// Check if offer is saved by current member
export async function checkOfferSaved(offerId: number, token: string): Promise<ApiResponse> {
  return apiFetch(`${API_BASE_URL}/member/offers/${offerId}/saved`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
}

// Get offer stats (for business owner)
export async function getOfferStats(offerId: number, token: string): Promise<ApiResponse> {
  return apiFetch(`${API_BASE_URL}/member/offers/${offerId}/stats`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
}