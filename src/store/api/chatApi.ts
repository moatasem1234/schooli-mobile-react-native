// src/store/chatApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { BackEndUrl } from '../../constants/BackEndUrl';
import { Conversation, Message, GeneralResponse } from '../../types/chat';

export const ChatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BackEndUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      headers.set('Cookie', '');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Conversation', 'Message'],
  endpoints: (builder) => ({
    // Get all conversations
    getConversations: builder.query<GeneralResponse<Conversation[]>, void>({
      query: () => '/chat/conversations',
      providesTags: ['Conversation'],
      transformResponse: (response: { conversations: Conversation[] }) => ({
        data: response.conversations,
        status: 200,
        message: 'Retrieved',
      }),
    }),

    // Start a new conversation
    startConversation: builder.mutation<
      GeneralResponse<{ id: number; title: string | null; created_at: string }>,
      { recipient_id: number; recipient_type: 'parent' | 'teacher'; title?: string }
    >({
      query: (body) => ({
        url: '/chat/conversations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversation'],
    }),

    // Get messages for a conversation
    getMessages: builder.query<
      GeneralResponse<Message[]>,
      { conversationId: number; page?: number; per_page?: number }
    >({
      query: ({ conversationId, page = 1, per_page = 50 }) =>
        `/chat/conversations/${conversationId}/messages?page=${page}&per_page=${per_page}`,
      providesTags: (result, error, { conversationId }) => [
        { type: 'Message', id: conversationId },
      ],
      transformResponse: (response: { messages: Message[] }) => ({
        data: response.messages,
        status: 200,
        message: 'Retrieved',
      }),
    }),

    // Send a message
    sendMessage: builder.mutation<
      GeneralResponse<Message>,
      { conversationId: number; content: string }
    >({
      query: ({ conversationId, content }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Message', id: conversationId },
        'Conversation',
      ],
    }),

    // Mark messages as read
    markAsRead: builder.mutation<
      GeneralResponse<string>,
      { conversationId: number }
    >({
      query: ({ conversationId }) => ({
        url: `/chat/conversations/${conversationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Message', id: conversationId },
        'Conversation',
      ],
    }),

    // Delete a message
    deleteMessage: builder.mutation<GeneralResponse<string>, number>({
      query: (messageId) => ({
        url: `/chat/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, messageId) => [
        { type: 'Message', id: messageId },
        'Conversation',
      ],
    }),

    // Get unread messages count
    getUnreadCount: builder.query<
      GeneralResponse<number>,
      { conversationId: number }
    >({
      query: ({ conversationId }) => `/chat/unread-count/${conversationId}`,
      providesTags: (result, error, { conversationId }) => [
        { type: 'Message', id: conversationId },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useStartConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
  useGetUnreadCountQuery,
} = ChatApi;