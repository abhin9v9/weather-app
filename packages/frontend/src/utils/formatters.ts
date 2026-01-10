import { format, fromUnixTime } from 'date-fns';

/**
 * Format temperature with unit
 */
export const formatTemperature = (
  temp: number,
  unit: 'celsius' | 'fahrenheit' = 'celsius'
): string => {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
};

/**
 * Convert Celsius to Fahrenheit
 */
export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

/**
 * Format wind speed
 */
export const formatWindSpeed = (speed: number, metric = true): string => {
  if (metric) {
    return `${speed.toFixed(1)} m/s`;
  }
  return `${(speed * 2.237).toFixed(1)} mph`;
};

/**
 * Format visibility
 */
export const formatVisibility = (visibility: number): string => {
  if (visibility >= 1000) {
    return `${(visibility / 1000).toFixed(1)} km`;
  }
  return `${visibility} m`;
};

/**
 * Format pressure
 */
export const formatPressure = (pressure: number): string => {
  return `${pressure} hPa`;
};

/**
 * Format humidity
 */
export const formatHumidity = (humidity: number): string => {
  return `${humidity}%`;
};

/**
 * Format Unix timestamp to time
 */
export const formatTime = (
  timestamp: number,
  timezoneOffset = 0
): string => {
  const date = fromUnixTime(timestamp + timezoneOffset);
  return format(date, 'HH:mm');
};

/**
 * Format Unix timestamp to date
 */
export const formatDate = (timestamp: number): string => {
  const date = fromUnixTime(timestamp);
  return format(date, 'EEE, MMM d');
};

/**
 * Format Unix timestamp to day name
 */
export const formatDayName = (timestamp: number): string => {
  const date = fromUnixTime(timestamp);
  return format(date, 'EEEE');
};

/**
 * Get weather icon URL
 */
export const getWeatherIconUrl = (icon: string, size: '2x' | '4x' = '2x'): string => {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
};

/**
 * Get weather background gradient based on conditions
 */
export const getWeatherBackground = (icon: string): string => {
  const timeOfDay = icon.endsWith('n') ? 'night' : 'day';
  const condition = icon.slice(0, 2);

  const backgrounds: Record<string, Record<string, string>> = {
    day: {
      '01': 'from-blue-400 to-blue-600', // Clear
      '02': 'from-blue-400 to-gray-400', // Few clouds
      '03': 'from-gray-400 to-gray-500', // Scattered clouds
      '04': 'from-gray-500 to-gray-600', // Broken clouds
      '09': 'from-gray-500 to-blue-600', // Shower rain
      '10': 'from-blue-500 to-gray-600', // Rain
      '11': 'from-gray-600 to-purple-700', // Thunderstorm
      '13': 'from-gray-300 to-blue-200', // Snow
      '50': 'from-gray-400 to-gray-500', // Mist
    },
    night: {
      '01': 'from-indigo-900 to-gray-900', // Clear
      '02': 'from-indigo-800 to-gray-800', // Few clouds
      '03': 'from-gray-700 to-gray-800', // Scattered clouds
      '04': 'from-gray-800 to-gray-900', // Broken clouds
      '09': 'from-gray-700 to-indigo-900', // Shower rain
      '10': 'from-indigo-800 to-gray-800', // Rain
      '11': 'from-gray-900 to-purple-900', // Thunderstorm
      '13': 'from-gray-600 to-indigo-800', // Snow
      '50': 'from-gray-600 to-gray-800', // Mist
    },
  };

  return backgrounds[timeOfDay][condition] || backgrounds[timeOfDay]['01'];
};
