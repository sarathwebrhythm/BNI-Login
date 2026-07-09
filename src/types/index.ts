export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface Member {
  id: number;
  bni_id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  chapter?: string;
  designation?: string;
  status?: string;
  profile_photo?: string;
  cover_photo?: string;
  business_logo?: string;
  joining_date?: string;
  expire_date?: string;
  offer_limit?: number;
}

// notification types
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  reference_id: number;
  created_at: string;
}

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
}

export interface NotificationCountResponse {
  success: boolean;
  count: number;
}