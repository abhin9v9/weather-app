import { Router } from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers';
import { authenticate, validateRequest } from '../middlewares';
import { addFavoriteValidation, favoriteIdValidation } from '../utils';

const router = Router();

// All favorites routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/favorites
 * @desc    Get all favorite cities for current user
 * @access  Private
 */
router.get('/', getFavorites);

/**
 * @route   GET /api/favorites/check
 * @desc    Check if a city is in favorites
 * @access  Private
 */
router.get('/check', checkFavorite);

/**
 * @route   POST /api/favorites
 * @desc    Add a city to favorites
 * @access  Private
 */
router.post('/', addFavoriteValidation, validateRequest, addFavorite);

/**
 * @route   DELETE /api/favorites/:id
 * @desc    Remove a city from favorites
 * @access  Private
 */
router.delete('/:id', favoriteIdValidation, validateRequest, removeFavorite);

export default router;
