import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { ApiResponse } from '../types/express.d';
import { Response } from 'express';

/**
 * General API rate limiter
 * Limits requests per IP address
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes by default
  max: config.rateLimit.max, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  } as ApiResponse,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req, res: Response<ApiResponse>, _next, options) => {
    res.status(options.statusCode).json(options.message as ApiResponse);
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.',
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  handler: (_req, res: Response<ApiResponse>, _next, options) => {
    res.status(options.statusCode).json(options.message as ApiResponse);
  },
});

/**
 * Rate limiter for weather API endpoints
 * More restrictive to manage external API usage
 */
export const weatherLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    message: 'Weather API rate limit exceeded. Please wait a moment.',
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res: Response<ApiResponse>, _next, options) => {
    res.status(options.statusCode).json(options.message as ApiResponse);
  },
});
