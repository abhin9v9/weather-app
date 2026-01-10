import { Request, Response, NextFunction } from 'express';
import { weatherService } from '../services';
import { ApiResponse } from '../types/express.d';
import { WeatherData, ForecastData } from '../types';
import { ApiError } from '../middlewares';

/**
 * Get current weather
 * GET /api/weather
 * Query params: city OR (lat, lon), units (optional)
 */
export const getCurrentWeather = async (
  req: Request<
    object,
    ApiResponse<WeatherData>,
    object,
    { city?: string; lat?: string; lon?: string; units?: 'metric' | 'imperial' | 'standard' }
  >,
  res: Response<ApiResponse<WeatherData>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { city, lat, lon, units = 'metric' } = req.query;

    let weatherData: WeatherData;

    if (city) {
      // Get weather by city name
      weatherData = await weatherService.getCurrentWeatherByCity(city, units);
    } else if (lat && lon) {
      // Get weather by coordinates
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new ApiError(400, 'Invalid coordinates provided');
      }

      weatherData = await weatherService.getCurrentWeatherByCoords(
        latitude,
        longitude,
        units
      );
    } else {
      throw new ApiError(
        400,
        'Please provide either a city name or coordinates (lat, lon)'
      );
    }

    res.status(200).json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get 5-day forecast
 * GET /api/weather/forecast
 * Query params: city OR (lat, lon), units (optional)
 */
export const getForecast = async (
  req: Request<
    object,
    ApiResponse<ForecastData>,
    object,
    { city?: string; lat?: string; lon?: string; units?: 'metric' | 'imperial' | 'standard' }
  >,
  res: Response<ApiResponse<ForecastData>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { city, lat, lon, units = 'metric' } = req.query;

    let forecastData: ForecastData;

    if (city) {
      // Get forecast by city name
      forecastData = await weatherService.getForecastByCity(city, units);
    } else if (lat && lon) {
      // Get forecast by coordinates
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new ApiError(400, 'Invalid coordinates provided');
      }

      forecastData = await weatherService.getForecastByCoords(
        latitude,
        longitude,
        units
      );
    } else {
      throw new ApiError(
        400,
        'Please provide either a city name or coordinates (lat, lon)'
      );
    }

    res.status(200).json({
      success: true,
      data: forecastData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search for cities (geocoding)
 * GET /api/weather/search
 * Query params: q (search query)
 */
export const searchCities = async (
  req: Request<object, ApiResponse, object, { q?: string }>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      throw new ApiError(400, 'Search query must be at least 2 characters');
    }

    const location = await weatherService.getCoordinates(q);

    res.status(200).json({
      success: true,
      data: {
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon,
      },
    });
  } catch (error) {
    next(error);
  }
};
