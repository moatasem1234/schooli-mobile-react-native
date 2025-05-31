// src/types/student.ts
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  gender: string;
  birthday: string;
  phone: string;
  address: string;
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

export interface Classroom {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  parent_id: number;
  classroom_id: number;
  gender: string;
  name: string;
  birth_date: string;
  created_at: string;
  updated_at: string;
  parent: Parent;
  classroom: Classroom;
}


// Payload for creating/updating a student
export interface StudentPayload {
  name: string;
  gender: string;
  birth_date: string;
  parent_id: number;
  classroom_id: number;
}

// Response types (aligned with CartApi)
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