// src/types/classroom.ts
export interface Classroom {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ClassroomPayload {
  name: string;
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