import api from './axios';
import type { ApiResponse } from '../types';

export const favoritesApi = {
  // Get user's favorites
  getFavorites: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/favorites');
    return response.data;
  },

  // Add city to favorites
  addFavorite: async (city: string): Promise<ApiResponse<string[]>> => {
    const response = await api.post('/favorites', { city });
    return response.data;
  },

  // Remove city from favorites
  removeFavorite: async (city: string): Promise<ApiResponse<string[]>> => {
    const response = await api.delete(`/favorites/${encodeURIComponent(city)}`);
    return response.data;
  },
};