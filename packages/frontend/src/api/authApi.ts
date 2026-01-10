import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  ApiResponse,
  User,
  LoginCredentials,
  RegisterData,
  UserPreferences,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include', // Important for cookies
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Register new user
    register: builder.mutation<ApiResponse<{ user: User }>, RegisterData>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Login user
    login: builder.mutation<ApiResponse<{ user: User }>, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Logout user
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Get current user
    getCurrentUser: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Refresh token
    refreshToken: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),

    // Update preferences
    updatePreferences: builder.mutation<
      ApiResponse<{ user: User }>,
      Partial<UserPreferences>
    >({
      query: (preferences) => ({
        url: '/auth/preferences',
        method: 'PATCH',
        body: preferences,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useUpdatePreferencesMutation,
} = authApi;
