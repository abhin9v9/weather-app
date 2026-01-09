import { Request, Response } from 'express';
import {
  getCurrentWeather,
  getWeatherByCoords,
  getForecast,
  getForecastByCoords,
} from '../services/weatherService';

// Get current weather by city
export const getWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city } = req.params;

    if (!city) {
      res.status(400).json({
        success: false,
        message: 'City name is required',
      });
      return;
    }

    const weather = await getCurrentWeather(city);

    res.status(200).json({
      success: true,
      data: weather,
    });
  } catch (error: any) {
    res.status(error.message === 'City not found' ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get weather by coordinates
export const getWeatherByLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
      return;
    }

    const weather = await getWeatherByCoords(
      parseFloat(lat as string),
      parseFloat(lon as string)
    );

    res.status(200).json({
      success: true,
      data: weather,
    });
  } catch (error: any) {
    res.status(error.message === 'Location not found' ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get forecast by city
export const getCityForecast = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { city } = req.params;

    if (!city) {
      res.status(400).json({
        success: false,
        message: 'City name is required',
      });
      return;
    }

    const forecast = await getForecast(city);

    res.status(200).json({
      success: true,
      data: forecast,
    });
  } catch (error: any) {
    res.status(error.message === 'City not found' ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get forecast by coordinates
export const getLocationForecast = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
      return;
    }

    const forecast = await getForecastByCoords(
      parseFloat(lat as string),
      parseFloat(lon as string)
    );

    res.status(200).json({
      success: true,
      data: forecast,
    });
  } catch (error: any) {
    res.status(error.message === 'Location not found' ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};