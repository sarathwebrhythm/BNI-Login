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
  message: string;
  photo_url?: string;
  cover_url?: string;
  logo_url?: string;
  categories?: { id: number; name: string; icon?: string }[];
  offers?: any[];
  offer?: any;
}

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

export async function uploadProfilePhoto(file: File, token: string): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("photo", file);
  const res = await fetch(`${API_BASE_URL}/member/update-profile-photo`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
}

export async function uploadCoverPhoto(file: File, token: string): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("cover", file);
  const res = await fetch(`${API_BASE_URL}/member/update-cover-photo`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
}

export async function uploadBusinessLogo(file: File, token: string): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("logo", file);
  const res = await fetch(`${API_BASE_URL}/member/update-business-logo`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
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

// Get offer categories
export async function getOfferCategories(token: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/member/offer-categories`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Create offer
export async function createOffer(formData: FormData, token: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/member/offers`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
}

// Get member offers (logged-in member's own offers)
export async function getMemberOffers(token: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/member/offers`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Get all active offers (public feed, from all members)
export async function getAllActiveOffers(token: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/member/all-offers`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Delete offer
export async function deleteOffer(id: number, token: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/member/offers/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  return res.json();
}