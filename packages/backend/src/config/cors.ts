import { CorsOptions } from 'cors';
import config from './config';

// Build allowed origins from environment variables
const allowedOrigins: string[] = [
  'http://localhost:5173',
  'http://localhost:3000',
];

// Add frontend URL if set
if (config.cors.frontendUrl) {
  // Remove trailing slash if present for consistent matching
  const frontendUrl = config.cors.frontendUrl.replace(/\/$/, '');
  allowedOrigins.push(frontendUrl);
}

// Add additional CORS origins if set (comma-separated)
if (process.env.CORS_ORIGIN) {
  const origins = process.env.CORS_ORIGIN.split(',').map(o => o.trim().replace(/\/$/, ''));
  allowedOrigins.push(...origins);
}

console.log('Allowed CORS origins:', allowedOrigins);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Remove trailing slash from incoming origin for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalizedOrigin) || config.nodeEnv === 'development') {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
  maxAge: 86400, // Cache preflight requests for 24 hours
  optionsSuccessStatus: 200,
};

export default corsOptions;
