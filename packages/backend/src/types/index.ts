// User types
export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  theme: 'light' | 'dark';
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  createdAt: Date;
}

// Auth types
export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Favorite types
export interface IFavorite {
  _id: string;
  userId: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: Date;
}

export interface CreateFavoriteDTO {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export interface FavoriteResponse {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: Date;
}

// Weather types
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
  pop: number; // Probability of precipitation
}

// OpenWeatherMap API response types
export interface OpenWeatherCurrentResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface OpenWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h'?: number;
    };
    snow?: {
      '3h'?: number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface GeocodingResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
