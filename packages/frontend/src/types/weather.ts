// Weather data types
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  description: string;
  icon: string;
  visibility: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export interface ForecastData {
  city: string;
  country: string;
  list: ForecastItem[];
}

export interface ForecastItem {
  dt: number;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  pop: number;
}

// Favorite types
export interface Favorite {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: string;
}

export interface AddFavoriteData {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

// Weather state
export interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  isLoading: boolean;
  error: string | null;
  searchHistory: string[];
}
