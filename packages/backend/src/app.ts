import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config, corsOptions } from './config';
import routes from './routes';
import { errorHandler, notFound, apiLimiter } from './middlewares';

/**
 * Create and configure Express application
 */
const createApp = (): Application => {
  const app = express();

  // Trust proxy for production (Render, Heroku, etc.)
  if (config.nodeEnv === 'production') {
    app.set('trust proxy', 1);
  }

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(cors(corsOptions));

  // Request logging
  if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Body parsing
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Cookie parsing
  app.use(cookieParser());

  // Rate limiting for all API routes
  app.use('/api', apiLimiter);

  // API routes
  app.use('/api', routes);

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Weather Dashboard API',
      version: '1.0.0',
      documentation: '/api/health',
    });
  });

  // 404 handler
  app.use(notFound);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp;
