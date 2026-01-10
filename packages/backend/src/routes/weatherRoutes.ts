import { Router } from 'express';
import { getCurrentWeather, getForecast, searchCities } from '../controllers';
import { validateRequest, weatherLimiter } from '../middlewares';
import { weatherQueryValidation } from '../utils';

const router = Router();

/**
 * @route   GET /api/weather
 * @desc    Get current weather by city or coordinates
 * @access  Public
 */
router.get(
  '/',
  weatherLimiter,
  weatherQueryValidation,
  validateRequest,
  getCurrentWeather
);

/**
 * @route   GET /api/weather/forecast
 * @desc    Get 5-day forecast by city or coordinates
 * @access  Public
 */
router.get(
  '/forecast',
  weatherLimiter,
  weatherQueryValidation,
  validateRequest,
  getForecast
);

/**
 * @route   GET /api/weather/search
 * @desc    Search for cities (geocoding)
 * @access  Public
 */
router.get('/search', weatherLimiter, searchCities);

export default router;
