import api from './axios';
import type { ApiResponse, WeatherData, ForecastData } from '../types';

export const weatherApi = {
  // Get current weather by city
  getCurrentWeather: async (city: string): Promise<ApiResponse<WeatherData>> => {
    const response = await api.get(`/weather/current/${encodeURIComponent(city)}`);
    return response.data;
  },

  // Get current weather by coordinates
  getWeatherByCoords: async (lat: number, lon: number): Promise<ApiResponse<WeatherData>> => {
    const response = await api.get('/weather/current', {
      params: { lat, lon },
    });
    return response.data;
  },

  // Get forecast by city
  getForecast: async (city: string): Promise<ApiResponse<ForecastData>> => {
    const response = await api.get(`/weather/forecast/${encodeURIComponent(city)}`);
    return response.data;
  },

  // Get forecast by coordinates
  getForecastByCoords: async (lat: number, lon: number): Promise<ApiResponse<ForecastData>> => {
    const response = await api.get('/weather/forecast', {
      params: { lat, lon },
    });
    return response.data;
  },
};