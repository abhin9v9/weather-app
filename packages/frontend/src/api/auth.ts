import api from './axios';
import type { ApiResponse, AuthResponse, LoginForm, RegisterForm, User } from '../types';

export const authApi = {
  // Register new user
  register: async (data: RegisterForm): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  // Login user
  login: async (data: LoginForm): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Get current user
  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
};