import { Favorite } from '../models';
import { ApiError } from '../middlewares';
import { CreateFavoriteDTO, FavoriteResponse } from '../types';

/**
 * Favorites Service
 * Handles user favorite cities operations
 */
class FavoritesService {
  /**
   * Get all favorites for a user
   */
  async getFavorites(userId: string): Promise<FavoriteResponse[]> {
    const favorites = await Favorite.findByUser(userId);
    return favorites.map(this.transformFavoriteResponse);
  }

  /**
   * Add a new favorite city
   */
  async addFavorite(
    userId: string,
    favoriteData: CreateFavoriteDTO
  ): Promise<FavoriteResponse> {
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId,
      city: { $regex: new RegExp(`^${favoriteData.city}$`, 'i') },
      country: favoriteData.country,
    });

    if (existingFavorite) {
      throw new ApiError(409, 'This city is already in your favorites');
    }

    // Check favorite limit (e.g., max 20 favorites)
    const favoriteCount = await Favorite.countDocuments({ userId });
    if (favoriteCount >= 20) {
      throw new ApiError(400, 'Maximum number of favorites (20) reached');
    }

    // Create new favorite
    const favorite = await Favorite.create({
      userId,
      city: favoriteData.city,
      country: favoriteData.country,
      lat: favoriteData.lat,
      lon: favoriteData.lon,
    });

    return this.transformFavoriteResponse(favorite);
  }

  /**
   * Remove a favorite by ID
   */
  async removeFavorite(userId: string, favoriteId: string): Promise<void> {
    const favorite = await Favorite.findOne({
      _id: favoriteId,
      userId,
    });

    if (!favorite) {
      throw new ApiError(404, 'Favorite not found');
    }

    await Favorite.deleteOne({ _id: favoriteId });
  }

  /**
   * Remove a favorite by city name
   */
  async removeFavoriteByCity(userId: string, city: string): Promise<void> {
    const result = await Favorite.deleteOne({
      userId,
      city: { $regex: new RegExp(`^${city}$`, 'i') },
    });

    if (result.deletedCount === 0) {
      throw new ApiError(404, 'Favorite not found');
    }
  }

  /**
   * Check if a city is favorited by user
   */
  async isFavorite(userId: string, city: string): Promise<boolean> {
    const favorite = await Favorite.findOne({
      userId,
      city: { $regex: new RegExp(`^${city}$`, 'i') },
    });
    return !!favorite;
  }

  /**
   * Transform favorite document to response format
   */
  private transformFavoriteResponse(favorite: {
    _id: unknown;
    city: string;
    country: string;
    lat: number;
    lon: number;
    addedAt: Date;
  }): FavoriteResponse {
    return {
      id: favorite._id as string,
      city: favorite.city,
      country: favorite.country,
      lat: favorite.lat,
      lon: favorite.lon,
      addedAt: favorite.addedAt,
    };
  }
}

// Export singleton instance
export const favoritesService = new FavoritesService();
