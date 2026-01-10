import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WeatherData, ForecastData, WeatherState } from '../../types';

const SEARCH_HISTORY_KEY = 'weather_search_history';

// Load search history from localStorage
const loadSearchHistory = (): string[] => {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save search history to localStorage
const saveSearchHistory = (history: string[]) => {
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Ignore localStorage errors
  }
};

const initialState: WeatherState = {
  currentWeather: null,
  forecast: null,
  isLoading: false,
  error: null,
  searchHistory: loadSearchHistory(),
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCurrentWeather: (state, action: PayloadAction<WeatherData | null>) => {
      state.currentWeather = action.payload;
      state.error = null;
    },
    setForecast: (state, action: PayloadAction<ForecastData | null>) => {
      state.forecast = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addToSearchHistory: (state, action: PayloadAction<string>) => {
      const city = action.payload;
      // Remove if already exists
      state.searchHistory = state.searchHistory.filter(
        (c) => c.toLowerCase() !== city.toLowerCase()
      );
      // Add to beginning
      state.searchHistory.unshift(city);
      // Keep only last 10
      state.searchHistory = state.searchHistory.slice(0, 10);
      // Save to localStorage
      saveSearchHistory(state.searchHistory);
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
      saveSearchHistory([]);
    },
    removeFromSearchHistory: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(
        (c) => c.toLowerCase() !== action.payload.toLowerCase()
      );
      saveSearchHistory(state.searchHistory);
    },
    clearWeatherData: (state) => {
      state.currentWeather = null;
      state.forecast = null;
      state.error = null;
    },
  },
});

export const {
  setCurrentWeather,
  setForecast,
  setLoading,
  setError,
  addToSearchHistory,
  clearSearchHistory,
  removeFromSearchHistory,
  clearWeatherData,
} = weatherSlice.actions;

export default weatherSlice.reducer;
