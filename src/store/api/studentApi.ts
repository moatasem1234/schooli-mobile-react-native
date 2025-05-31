// src/store/studentApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { BackEndUrl } from '../../constants/BackEndUrl'; // Assuming API is your base URL (e.g., 'http://your-api.com')
import {
  Student,
  StudentPayload,
  GeneralResponse,
  PaginatedResponse,
} from '../../types/student';

export const StudentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BackEndUrl,
    prepareHeaders: (headers, { getState }) => {
      // Add authorization token if available
      const token = (getState() as RootState).auth.token;
      headers.set('Cookie', '');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Student'],
  endpoints: (builder) => ({
    // Fetch all students (GET /students)
    getStudents: builder.query<PaginatedResponse<Student>, void>({
      query: () => '/students',
      providesTags: ['Student'],
    }),

    // Fetch a single student (GET /students/:id)
    getStudentById: builder.query<GeneralResponse<Student>, number>({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    // Create a student (POST /students)
    createStudent: builder.mutation<GeneralResponse<Student>, StudentPayload>({
      query: (body) => ({
        url: '/students',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Student'],
    }),

    // Update a student (PUT /students/:id)
    updateStudent: builder.mutation<
      GeneralResponse<Student>,
      { id: number; data: Partial<StudentPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Student'],
    }),

    // Delete a student (DELETE /students/:id)
    deleteStudent: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Student', id }, 'Student'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = StudentApi;