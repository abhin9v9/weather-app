import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch, logout } from '../store';
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  favoritesApi,
} from '../api';
import type { LoginCredentials, RegisterData } from '../types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  // API hooks
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Login handler
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await loginMutation(credentials).unwrap();
        if (result.success) {
          toast.success('Welcome back!');
          navigate('/dashboard');
          return true;
        }
        return false;
      } catch (err) {
        const error = err as { data?: { message?: string } };
        toast.error(error.data?.message || 'Login failed');
        return false;
      }
    },
    [loginMutation, navigate]
  );

  // Register handler
  const register = useCallback(
    async (data: RegisterData) => {
      try {
        const result = await registerMutation(data).unwrap();
        if (result.success) {
          toast.success('Account created successfully!');
          navigate('/dashboard');
          return true;
        }
        return false;
      } catch (err) {
        const error = err as { data?: { message?: string } };
        toast.error(error.data?.message || 'Registration failed');
        return false;
      }
    },
    [registerMutation, navigate]
  );

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
      // Reset favorites cache to prevent data leak between users
      dispatch(favoritesApi.util.resetApiState());
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      // Still logout locally even if server request fails
      dispatch(favoritesApi.util.resetApiState());
      dispatch(logout());
      navigate('/login');
    }
  }, [logoutMutation, dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
    error,
    login,
    register,
    logout: handleLogout,
  };
};
