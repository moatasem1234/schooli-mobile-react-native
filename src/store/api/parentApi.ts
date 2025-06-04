// src/store/parentApi.ts
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RootState} from '../store';
import {BackEndUrl} from '../../constants/BackEndUrl';

import {
  Parent,
  ParentPayload,
  GeneralResponse,
  PaginatedResponse,
} from '../../types/parent';
import {TeacherResponse} from '../../types/theacher';
import {setUser} from '../authSlice';
import {User} from '../../types/auth';

interface UpdateProfileRequest {
  userId?: number;
  name?: string;
  email?: string;
  password?: string;
}

interface UpdateProfileResponse {
  data: User;
  status: number;
  message: string;
}

export const ParentApi = createApi({
  reducerPath: 'parentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BackEndUrl,
    prepareHeaders: (headers, {getState}) => {
      const token = (getState() as RootState).auth.token;
      headers.set('Cookie', '');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Parent', 'teachers'],
  endpoints: builder => ({
    getParents: builder.query<PaginatedResponse<Parent>, void>({
      query: () => '/parents',
      providesTags: ['Parent'],
    }),
    getTeachers: builder.query<PaginatedResponse<TeacherResponse>, void>({
      query: () => '/teachers',
      providesTags: ['teachers'],
    }),

    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: ({userId, ...body}) => ({
        url: `/auth/update-profile/${userId}`,
        method: 'PUT',
        body,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          // Update Redux store with new user data
          console.log('builder.mutation data', data.data);
          dispatch(setUser(data.data));
        } catch (error) {
          console.error('Failed to update profile:', error);
        }
      },
    }),
    getParentById: builder.query<GeneralResponse<Parent>, number>({
      query: id => `/parents/${id}`,
      providesTags: (result, error, id) => [{type: 'Parent', id}],
    }),
    createParent: builder.mutation<GeneralResponse<Parent>, ParentPayload>({
      query: body => ({
        url: '/parents',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Parent'],
    }),
    updateParent: builder.mutation<
      GeneralResponse<Parent>,
      {id: number; data: Partial<ParentPayload>}
    >({
      query: ({id, data}) => ({
        url: `/parents/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, {id}) => [
        {type: 'Parent', id},
        'Parent',
      ],
    }),
    deleteParent: builder.mutation<GeneralResponse<null>, number>({
      query: id => ({
        url: `/parents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{type: 'Parent', id}, 'Parent'],
    }),
  }),
});

export const {
  useGetParentsQuery,
  useGetTeachersQuery,
  useUpdateProfileMutation,
  useGetParentByIdQuery,
  useCreateParentMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,
} = ParentApi;
