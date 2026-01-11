import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { config } from '../config';
import { ApiResponse } from '../types/express.d';
import { CreateUserDTO, LoginDTO, UserResponse, AuthTokens } from '../types';
import { getTokenExpiration } from '../utils';

// Cookie options for tokens
// For cross-origin (Vercel frontend -> Render backend), we need sameSite: 'none' and secure: true
const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: config.nodeEnv === 'production' ? ('none' as const) : ('lax' as const),
  maxAge,
  path: '/',
});

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (
  req: Request<object, ApiResponse<{ user: UserResponse }>, CreateUserDTO>,
  res: Response<ApiResponse<{ user: UserResponse }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, tokens } = await authService.register(req.body);

    // Set cookies
    setAuthCookies(res, tokens);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (
  req: Request<object, ApiResponse<{ user: UserResponse }>, LoginDTO>,
  res: Response<ApiResponse<{ user: UserResponse }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, tokens } = await authService.login(req.body);

    // Set cookies
    setAuthCookies(res, tokens);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): Promise<void> => {
  // Clear cookies
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshToken = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Get refresh token from cookie or body
    const refreshTokenValue =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshTokenValue) {
      res.status(401).json({
        success: false,
        message: 'Refresh token not provided',
      });
      return;
    }

    const tokens = await authService.refreshToken(refreshTokenValue);

    // Set new cookies
    setAuthCookies(res, tokens);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    // Clear invalid cookies
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    next(error);
  }
};

/**
 * Get current user
 * GET /api/auth/me
 */
export const getCurrentUser = async (
  req: Request,
  res: Response<ApiResponse<{ user: UserResponse }>>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await authService.getUserById(req.user.id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user preferences
 * PATCH /api/auth/preferences
 */
export const updatePreferences = async (
  req: Request,
  res: Response<ApiResponse<{ user: UserResponse }>>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await authService.updatePreferences(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to set auth cookies
 */
const setAuthCookies = (res: Response, tokens: AuthTokens): void => {
  const accessTokenMaxAge = getTokenExpiration(config.jwt.expiresIn);
  const refreshTokenMaxAge = getTokenExpiration(config.jwt.refreshExpiresIn);

  res.cookie('accessToken', tokens.accessToken, getCookieOptions(accessTokenMaxAge));
  res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(refreshTokenMaxAge));
};
