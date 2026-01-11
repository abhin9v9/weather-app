import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, WeatherData, ForecastData } from '../types';
import baseQueryWithReauth from './baseQuery';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Weather', 'Forecast'],
  endpoints: (builder) => ({
    // Get current weather by city
    getWeatherByCity: builder.query<
      ApiResponse<WeatherData>,
      { city: string; units?: 'metric' | 'imperial' }
    >({
      query: ({ city, units = 'metric' }) => ({
        url: '/weather',
        params: { city, units },
      }),
      providesTags: (_result, _error, { city }) => [
        { type: 'Weather', id: city },
      ],
    }),

    // Get current weather by coordinates
    getWeatherByCoords: builder.query<
      ApiResponse<WeatherData>,
      { lat: number; lon: number; units?: 'metric' | 'imperial' }
    >({
      query: ({ lat, lon, units = 'metric' }) => ({
        url: '/weather',
        params: { lat, lon, units },
      }),
      providesTags: ['Weather'],
    }),

    // Get forecast by city
    getForecastByCity: builder.query<
      ApiResponse<ForecastData>,
      { city: string; units?: 'metric' | 'imperial' }
    >({
      query: ({ city, units = 'metric' }) => ({
        url: '/weather/forecast',
        params: { city, units },
      }),
      providesTags: (_result, _error, { city }) => [
        { type: 'Forecast', id: city },
      ],
    }),

    // Get forecast by coordinates
    getForecastByCoords: builder.query<
      ApiResponse<ForecastData>,
      { lat: number; lon: number; units?: 'metric' | 'imperial' }
    >({
      query: ({ lat, lon, units = 'metric' }) => ({
        url: '/weather/forecast',
        params: { lat, lon, units },
      }),
      providesTags: ['Forecast'],
    }),

    // Search cities
    searchCities: builder.query<
      ApiResponse<{
        name: string;
        country: string;
        state?: string;
        lat: number;
        lon: number;
      }>,
      string
    >({
      query: (query) => ({
        url: '/weather/search',
        params: { q: query },
      }),
    }),
  }),
});

export const {
  useGetWeatherByCityQuery,
  useGetWeatherByCoordsQuery,
  useGetForecastByCityQuery,
  useGetForecastByCoordsQuery,
  useSearchCitiesQuery,
  useLazyGetWeatherByCityQuery,
  useLazyGetForecastByCityQuery,
  useLazySearchCitiesQuery,
} = weatherApi;
