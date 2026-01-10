// User types
export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  theme: 'light' | 'dark';
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
