import { Router } from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favoritesController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:city', removeFavorite);

export default router;