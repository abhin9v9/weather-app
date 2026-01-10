import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, Favorite, AddFavoriteData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Favorites'],
  endpoints: (builder) => ({
    // Get all favorites
    getFavorites: builder.query<ApiResponse<Favorite[]>, void>({
      query: () => '/favorites',
      providesTags: ['Favorites'],
    }),

    // Add favorite
    addFavorite: builder.mutation<ApiResponse<Favorite>, AddFavoriteData>({
      query: (data) => ({
        url: '/favorites',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Favorites'],
    }),

    // Remove favorite
    removeFavorite: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/favorites/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorites'],
    }),

    // Check if city is favorite
    checkFavorite: builder.query<
      ApiResponse<{ isFavorite: boolean }>,
      string
    >({
      query: (city) => ({
        url: '/favorites/check',
        params: { city },
      }),
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useCheckFavoriteQuery,
  useLazyCheckFavoriteQuery,
} = favoritesApi;
