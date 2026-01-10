import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';
import { TokenPayload, AuthTokens } from '../types';

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (payload: Omit<TokenPayload, 'iat' | 'exp'>): AuthTokens => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw error;
  }
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload | null;
    if (!decoded) return null;

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
};

/**
 * Get token expiration time in milliseconds
 */
export const getTokenExpiration = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 900000; // Default 15 minutes

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (multipliers[unit] || 1000);
};
