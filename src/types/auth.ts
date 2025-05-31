// src/store/authSlice.ts

export interface Permission {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
  pivot: {
    role_id: number;
    permission_id: number;
  };
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
  pivot: {
    user_id: number;
    role_id: number;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  gender?: string; // Optional, based on JSON
  address?: string; // Optional
  phone?: string; // Optional
  image?: string | null; // Optional
  created_at?: string; // Optional
  updated_at?: string; // Optional
  roles: Role[];
  permissions: Permission[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}