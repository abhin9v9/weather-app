import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from '../../types';
import { authApi } from '../../api';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle login
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
          state.error = null;
        }
      }
    );
    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (state, action) => {
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
      }
    );

    // Handle register
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
          state.error = null;
        }
      }
    );
    builder.addMatcher(
      authApi.endpoints.register.matchRejected,
      (state, action) => {
        state.error = action.error.message || 'Registration failed';
      }
    );

    // Handle get current user
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchPending,
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchFulfilled,
      (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
        state.error = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchRejected,
      (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      }
    );

    // Handle logout
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });

    // Handle preferences update
    builder.addMatcher(
      authApi.endpoints.updatePreferences.matchFulfilled,
      (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.user = action.payload.data.user;
        }
      }
    );
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
