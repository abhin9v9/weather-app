import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { config } from '../config';
import { ApiResponse } from '../types/express.d';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found error handler
 */
export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

/**
 * Global error handler
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(', ');
    isOperational = true;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    isOperational = true;
  }

  // Handle Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
    statusCode = 409;
    const keyValue = (err as { keyValue?: Record<string, string> }).keyValue;
    if (keyValue) {
      const field = Object.keys(keyValue)[0];
      message = `A record with this ${field} already exists`;
    } else {
      message = 'Duplicate field value entered';
    }
    isOperational = true;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    isOperational = true;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
    isOperational = true;
  }

  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
      isOperational,
    });
  }

  // Log operational errors in production (for monitoring)
  if (config.nodeEnv === 'production' && !isOperational) {
    console.error('❌ Unexpected Error:', err);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message:
      config.nodeEnv === 'production' && !isOperational
        ? 'Something went wrong'
        : message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};
