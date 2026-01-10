import { body, query, param, ValidationChain } from 'express-validator';

/**
 * Validation rules for user registration
 */
export const registerValidation: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .isLength({ max: 128 })
    .withMessage('Password cannot exceed 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
];

/**
 * Validation rules for user login
 */
export const loginValidation: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Validation rules for refresh token
 */
export const refreshTokenValidation: ValidationChain[] = [
  body('refreshToken')
    .optional()
    .isString()
    .withMessage('Refresh token must be a string'),
];

/**
 * Validation rules for weather query
 */
export const weatherQueryValidation: ValidationChain[] = [
  query('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s,'-]+$/)
    .withMessage('City name contains invalid characters'),

  query('lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  query('lon')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  query('units')
    .optional()
    .isIn(['metric', 'imperial', 'standard'])
    .withMessage('Units must be metric, imperial, or standard'),
];

/**
 * Validation rules for adding favorite
 */
export const addFavoriteValidation: ValidationChain[] = [
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City name is required')
    .isLength({ max: 100 })
    .withMessage('City name cannot exceed 100 characters'),

  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country code is required')
    .isLength({ min: 2, max: 3 })
    .withMessage('Country code must be 2-3 characters')
    .isUppercase()
    .withMessage('Country code must be uppercase'),

  body('lat')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('lon')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
];

/**
 * Validation rules for favorite ID parameter
 */
export const favoriteIdValidation: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Favorite ID is required')
    .isMongoId()
    .withMessage('Invalid favorite ID format'),
];

/**
 * Validation rules for updating user preferences
 */
export const updatePreferencesValidation: ValidationChain[] = [
  body('temperatureUnit')
    .optional()
    .isIn(['celsius', 'fahrenheit'])
    .withMessage('Temperature unit must be celsius or fahrenheit'),

  body('theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Theme must be light or dark'),
];
