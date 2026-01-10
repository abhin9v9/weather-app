import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  openWeather: {
    apiKey: string;
    baseUrl: string;
  };
  cors: {
    frontendUrl: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-dashboard',
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  openWeather: {
    apiKey: process.env.OPENWEATHER_API_KEY || '',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window
  },
};

// Validate required configuration
const validateConfig = (): void => {
  const requiredEnvVars = ['JWT_SECRET', 'OPENWEATHER_API_KEY'];
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0 && config.nodeEnv === 'production') {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  if (!config.openWeather.apiKey && config.nodeEnv !== 'test') {
    console.warn('⚠️  Warning: OPENWEATHER_API_KEY is not set. Weather API calls will fail.');
  }
};

validateConfig();

export default config;
