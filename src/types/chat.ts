// src/types/chat.ts
export interface User {
  id: number;
  name: string;
}

export interface Participant {
  id: number;
  name: string;
  type: 'parent' | 'teacher';
}

export interface Message {
  id: number;
  conversation_id: number;
  content: string;
  created_at: string;
  sender: {
    name: string;
    user: User;
    type: 'parent' | 'teacher';
  };
  is_mine: boolean;
}

export interface Conversation {
  id: number;
  title: string | null;
  participant: Participant;
  last_message: Message | null;
  unread_count: number;
  last_message_at: string | null;
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