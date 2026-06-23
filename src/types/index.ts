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
  chapter?: string;
  designation?: string;
  status?: string;
  profile_photo?: string;
}