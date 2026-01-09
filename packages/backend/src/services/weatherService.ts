import axios from 'axios';
import dotenv from 'dotenv';
import { WeatherData, ForecastData, ForecastItem } from '../types';

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get current weather by city name
export const getCurrentWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;

    return {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg || 0,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      visibility: data.visibility,
      clouds: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      dt: data.dt,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('City not found');
    }
    throw new Error('Failed to fetch weather data');
  }
};

// Get current weather by coordinates
export const getWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;

    return {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg || 0,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      visibility: data.visibility,
      clouds: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      dt: data.dt,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Location not found');
    }
    throw new Error('Failed to fetch weather data');
  }
};

// Get 5-day forecast by city name
export const getForecast = async (city: string): Promise<ForecastData> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;

    const forecastList: ForecastItem[] = data.list.map((item: any) => ({
      dt: item.dt,
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      tempMin: item.main.temp_min,
      tempMax: item.main.temp_max,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      windSpeed: item.wind.speed,
      windDirection: item.wind.deg || 0,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      clouds: item.clouds.all,
      pop: item.pop,
      rain: item.rain?.['3h'],
      snow: item.snow?.['3h'],
    }));

    return {
      city: data.city.name,
      country: data.city.country,
      list: forecastList,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('City not found');
    }
    throw new Error('Failed to fetch forecast data');
  }
};

// Get forecast by coordinates
export const getForecastByCoords = async (
  lat: number,
  lon: number
): Promise<ForecastData> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;

    const forecastList: ForecastItem[] = data.list.map((item: any) => ({
      dt: item.dt,
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      tempMin: item.main.temp_min,
      tempMax: item.main.temp_max,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      windSpeed: item.wind.speed,
      windDirection: item.wind.deg || 0,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      clouds: item.clouds.all,
      pop: item.pop,
      rain: item.rain?.['3h'],
      snow: item.snow?.['3h'],
    }));

    return {
      city: data.city.name,
      country: data.city.country,
      list: forecastList,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Location not found');
    }
    throw new Error('Failed to fetch forecast data');
  }
};