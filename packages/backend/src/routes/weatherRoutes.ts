import { Router } from 'express';
import {
  getWeather,
  getWeatherByLocation,
  getCityForecast,
  getLocationForecast,
} from '../controllers/weatherController';

const router = Router();

// Current weather routes
router.get('/current/:city', getWeather);
router.get('/current', getWeatherByLocation);

// Forecast routes
router.get('/forecast/:city', getCityForecast);
router.get('/forecast', getLocationForecast);

export default router;