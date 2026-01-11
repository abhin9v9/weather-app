import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  ApiResponse,
  User,
  LoginCredentials,
  RegisterData,
  UserPreferences,
} from '../types';
import baseQueryWithReauth, { setTokens, clearTokens } from './baseQuery';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Register new user
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterData>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            setTokens(data.data.accessToken, data.data.refreshToken);
          }
        } catch {
          // Handle error silently
        }
      },
      invalidatesTags: ['User'],
    }),

    // Login user
    login: builder.mutation<ApiResponse<AuthResponse>, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            setTokens(data.data.accessToken, data.data.refreshToken);
          }
        } catch {
          // Handle error silently
        }
      },
      invalidatesTags: ['User'],
    }),

    // Logout user
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          clearTokens();
        }
      },
      invalidatesTags: ['User'],
    }),

    // Get current user
    getCurrentUser: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Refresh token
    refreshToken: builder.mutation<ApiResponse<{ accessToken: string; refreshToken: string }>, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            setTokens(data.data.accessToken, data.data.refreshToken);
          }
        } catch {
          clearTokens();
        }
      },
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
