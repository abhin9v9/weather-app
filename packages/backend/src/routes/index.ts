import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';
import weatherRoutes from './weatherRoutes';
import favoritesRoutes from './favoritesRoutes';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * Mount route modules
 */
router.use('/auth', authRoutes);
router.use('/weather', weatherRoutes);
router.use('/favorites', favoritesRoutes);

export default router;
