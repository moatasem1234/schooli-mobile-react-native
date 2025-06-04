// src/types/parent.ts
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  gender: string | null;
  birthday: string | null;
  phone: string | null;
  address: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Parent {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: User;
}

// Updated ParentPayload to include fields for creating a User
export interface ParentPayload {
  name: string;
  email: string;
  password: string;
  user_id?: number; // Optional for updates
}

export interface GeneralResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  status: number;
  message: string;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}