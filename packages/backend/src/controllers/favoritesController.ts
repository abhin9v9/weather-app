import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';

// Get user's favorite cities
export const getFavorites = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
    });
  }
};

// Add city to favorites
export const addFavorite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { city } = req.body;

    if (!city) {
      res.status(400).json({
        success: false,
        message: 'City name is required',
      });
      return;
    }

    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Check if city already in favorites
    if (user.favorites.includes(city)) {
      res.status(400).json({
        success: false,
        message: 'City already in favorites',
      });
      return;
    }

    // Add city to favorites
    user.favorites.push(city);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'City added to favorites',
      data: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding favorite',
    });
  }
};

// Remove city from favorites
export const removeFavorite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { city } = req.params;

    if (!city) {
      res.status(400).json({
        success: false,
        message: 'City name is required',
      });
      return;
    }

    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Remove city from favorites
    user.favorites = user.favorites.filter(
      (fav) => fav.toLowerCase() !== city.toLowerCase()
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'City removed from favorites',
      data: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing favorite',
    });
  }
};