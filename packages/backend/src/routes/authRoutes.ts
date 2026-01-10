import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  updatePreferences,
} from '../controllers';
import { authenticate, validateRequest, authLimiter } from '../middlewares';
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  updatePreferencesValidation,
} from '../utils';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  authLimiter,
  registerValidation,
  validateRequest,
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authLimiter, loginValidation, validateRequest, login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', refreshTokenValidation, validateRequest, refreshToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, getCurrentUser);

/**
 * @route   PATCH /api/auth/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.patch(
  '/preferences',
  authenticate,
  updatePreferencesValidation,
  validateRequest,
  updatePreferences
);

export default router;
