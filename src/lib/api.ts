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
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
  photo_url?: string;
}

export async function loginMember(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/member/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function uploadProfilePhoto(
  file: File,
  token: string
): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("photo", file);
  const res = await fetch(`${API_BASE_URL}/member/update-profile-photo`, {
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