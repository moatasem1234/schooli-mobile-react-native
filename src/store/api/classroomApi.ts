// src/store/classroomApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { BackEndUrl } from '../../constants/BackEndUrl';

import {
  Classroom,
  ClassroomPayload,
  GeneralResponse,
  PaginatedResponse,
} from '../../types/classroom';

export const ClassroomApi = createApi({
  reducerPath: 'classroomApi',
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
  tagTypes: ['Classroom'],
  endpoints: (builder) => ({
    // Fetch all classrooms (GET /classrooms)
    getClassrooms: builder.query<PaginatedResponse<Classroom>, void>({
      query: () => '/classrooms',
      providesTags: ['Classroom'],
    }),

    // Fetch a single classroom (GET /classrooms/:id)
    getClassroomById: builder.query<GeneralResponse<Classroom>, number>({
      query: (id) => `/classrooms/${id}`,
      providesTags: (result, error, id) => [{ type: 'Classroom', id }],
    }),

    // Create a classroom (POST /classrooms)
    createClassroom: builder.mutation<GeneralResponse<null>, ClassroomPayload>({
      query: (body) => ({
        url: '/classrooms',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Classroom'],
    }),

    // Update a classroom (PUT /classrooms/:id)
    updateClassroom: builder.mutation<
      GeneralResponse<Classroom>,
      { id: number; data: ClassroomPayload }
    >({
      query: ({ id, data }) => ({
        url: `/classrooms/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Classroom', id }, 'Classroom'],
    }),

    // Delete a classroom (DELETE /classrooms/:id)
    deleteClassroom: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/classrooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Classroom', id }, 'Classroom'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetClassroomsQuery,
  useGetClassroomByIdQuery,
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
} = ClassroomApi;