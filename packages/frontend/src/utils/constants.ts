// API URL
export const API_URL = import.meta.env.VITE_API_URL || '/api';

// App name
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Weather Dashboard';

// Weather condition descriptions
export const WEATHER_CONDITIONS: Record<string, string> = {
  '01': 'Clear Sky',
  '02': 'Few Clouds',
  '03': 'Scattered Clouds',
  '04': 'Broken Clouds',
  '09': 'Shower Rain',
  '10': 'Rain',
  '11': 'Thunderstorm',
  '13': 'Snow',
  '50': 'Mist',
};

// Default cities for quick access
export const DEFAULT_CITIES = [
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
];

// Wind direction names
export const WIND_DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE',
  'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW',
  'W', 'WNW', 'NW', 'NNW',
];

/**
 * Get wind direction from degrees
 */
export const getWindDirection = (degrees: number): string => {
  const index = Math.round(degrees / 22.5) % 16;
  return WIND_DIRECTIONS[index];
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  FAVORITES: '/favorites',
  SETTINGS: '/settings',
};
