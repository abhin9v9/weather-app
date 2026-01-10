import axios, { AxiosError } from 'axios';
import { config } from '../config';
import {
  WeatherData,
  ForecastData,
  ForecastItem,
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
  GeocodingResponse,
} from '../types';
import { ApiError } from '../middlewares';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org';

/**
 * Weather Service
 * Handles all interactions with OpenWeatherMap API
 */
class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.openWeather.apiKey;
    this.baseUrl = OPENWEATHER_BASE_URL;
  }

  /**
   * Get coordinates for a city name using geocoding API
   */
  async getCoordinates(city: string): Promise<GeocodingResponse> {
    try {
      const response = await axios.get<GeocodingResponse[]>(
        `${this.baseUrl}/geo/1.0/direct`,
        {
          params: {
            q: city,
            limit: 1,
            appid: this.apiKey,
          },
        }
      );

      if (!response.data || response.data.length === 0) {
        throw new ApiError(404, `City "${city}" not found`);
      }

      return response.data[0];
    } catch (error) {
      this.handleApiError(error, 'Failed to get coordinates');
      throw error;
    }
  }

  /**
   * Get current weather by city name
   */
  async getCurrentWeatherByCity(
    city: string,
    units: 'metric' | 'imperial' | 'standard' = 'metric'
  ): Promise<WeatherData> {
    try {
      const response = await axios.get<OpenWeatherCurrentResponse>(
        `${this.baseUrl}/data/2.5/weather`,
        {
          params: {
            q: city,
            units,
            appid: this.apiKey,
          },
        }
      );

      return this.transformCurrentWeather(response.data);
    } catch (error) {
      this.handleApiError(error, 'Failed to get weather data');
      throw error;
    }
  }

  /**
   * Get current weather by coordinates
   */
  async getCurrentWeatherByCoords(
    lat: number,
    lon: number,
    units: 'metric' | 'imperial' | 'standard' = 'metric'
  ): Promise<WeatherData> {
    try {
      const response = await axios.get<OpenWeatherCurrentResponse>(
        `${this.baseUrl}/data/2.5/weather`,
        {
          params: {
            lat,
            lon,
            units,
            appid: this.apiKey,
          },
        }
      );

      return this.transformCurrentWeather(response.data);
    } catch (error) {
      this.handleApiError(error, 'Failed to get weather data');
      throw error;
    }
  }

  /**
   * Get 5-day forecast by city name
   */
  async getForecastByCity(
    city: string,
    units: 'metric' | 'imperial' | 'standard' = 'metric'
  ): Promise<ForecastData> {
    try {
      const response = await axios.get<OpenWeatherForecastResponse>(
        `${this.baseUrl}/data/2.5/forecast`,
        {
          params: {
            q: city,
            units,
            appid: this.apiKey,
          },
        }
      );

      return this.transformForecast(response.data);
    } catch (error) {
      this.handleApiError(error, 'Failed to get forecast data');
      throw error;
    }
  }

  /**
   * Get 5-day forecast by coordinates
   */
  async getForecastByCoords(
    lat: number,
    lon: number,
    units: 'metric' | 'imperial' | 'standard' = 'metric'
  ): Promise<ForecastData> {
    try {
      const response = await axios.get<OpenWeatherForecastResponse>(
        `${this.baseUrl}/data/2.5/forecast`,
        {
          params: {
            lat,
            lon,
            units,
            appid: this.apiKey,
          },
        }
      );

      return this.transformForecast(response.data);
    } catch (error) {
      this.handleApiError(error, 'Failed to get forecast data');
      throw error;
    }
  }

  /**
   * Transform OpenWeatherMap current weather response to our format
   */
  private transformCurrentWeather(data: OpenWeatherCurrentResponse): WeatherData {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
      description: data.weather[0]?.description || '',
      icon: data.weather[0]?.icon || '',
      visibility: data.visibility,
      clouds: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
    };
  }

  /**
   * Transform OpenWeatherMap forecast response to our format
   */
  private transformForecast(data: OpenWeatherForecastResponse): ForecastData {
    const list: ForecastItem[] = data.list.map((item) => ({
      dt: item.dt,
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      tempMin: Math.round(item.main.temp_min),
      tempMax: Math.round(item.main.temp_max),
      humidity: item.main.humidity,
      description: item.weather[0]?.description || '',
      icon: item.weather[0]?.icon || '',
      windSpeed: item.wind.speed,
      pop: Math.round(item.pop * 100),
    }));

    return {
      city: data.city.name,
      country: data.city.country,
      list,
    };
  }

  /**
   * Handle API errors from OpenWeatherMap
   */
  private handleApiError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; cod?: number }>;
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;

      switch (status) {
        case 401:
          throw new ApiError(500, 'Weather API authentication failed');
        case 404:
          throw new ApiError(404, message || 'City not found');
        case 429:
          throw new ApiError(
            503,
            'Weather API rate limit exceeded. Please try again later.'
          );
        default:
          throw new ApiError(
            status || 500,
            message || defaultMessage
          );
      }
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, defaultMessage);
  }
}

// Export singleton instance
export const weatherService = new WeatherService();
