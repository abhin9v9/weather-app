import { Request, Response, NextFunction } from 'express';
import { favoritesService } from '../services';
import { ApiResponse } from '../types/express.d';
import { CreateFavoriteDTO, FavoriteResponse } from '../types';

/**
 * Get all favorites for current user
 * GET /api/favorites
 */
export const getFavorites = async (
  req: Request,
  res: Response<ApiResponse<FavoriteResponse[]>>,
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

    const favorites = await favoritesService.getFavorites(req.user.id);

    res.status(200).json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new favorite city
 * POST /api/favorites
 */
export const addFavorite = async (
  req: Request<object, ApiResponse<FavoriteResponse>, CreateFavoriteDTO>,
  res: Response<ApiResponse<FavoriteResponse>>,
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

    const favorite = await favoritesService.addFavorite(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: 'City added to favorites',
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a favorite by ID
 * DELETE /api/favorites/:id
 */
export const removeFavorite = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse>,
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

    await favoritesService.removeFavorite(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      message: 'City removed from favorites',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if a city is in favorites
 * GET /api/favorites/check
 */
export const checkFavorite = async (
  req: Request<object, ApiResponse<{ isFavorite: boolean }>, object, { city: string }>,
  res: Response<ApiResponse<{ isFavorite: boolean }>>,
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

    const { city } = req.query;
    if (!city) {
      res.status(400).json({
        success: false,
        message: 'City name is required',
      });
      return;
    }

    const isFavorite = await favoritesService.isFavorite(req.user.id, city);

    res.status(200).json({
      success: true,
      data: { isFavorite },
    });
  } catch (error) {
    next(error);
  }
};
