import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError as ExpressValidationError } from 'express-validator';
import { ApiResponse, ValidationError } from '../types/express.d';

/**
 * Middleware to handle validation errors from express-validator
 */
export const validateRequest = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors: ValidationError[] = errors
      .array()
      .map((error: ExpressValidationError) => {
        if (error.type === 'field') {
          return {
            field: error.path,
            message: error.msg,
          };
        }
        return {
          field: 'unknown',
          message: error.msg,
        };
      });

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors,
    });
    return;
  }

  next();
};
