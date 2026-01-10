import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi, weatherApi, favoritesApi } from '../api';
import { authReducer, weatherReducer, uiReducer } from './slices';

export const store = configureStore({
  reducer: {
    // API reducers
    [authApi.reducerPath]: authApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    // Slice reducers
    auth: authReducer,
    weather: weatherReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(weatherApi.middleware)
      .concat(favoritesApi.middleware),
  devTools: import.meta.env.DEV,
});

// Setup listeners for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
