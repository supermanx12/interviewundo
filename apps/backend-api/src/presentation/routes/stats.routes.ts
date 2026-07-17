import { Router, Request, Response } from 'express';
import { PrismaUserRepository } from '../../infrastructure/database/repositories/PrismaUserRepository';

const router = Router();
const userRepository = new PrismaUserRepository();

// GET /api/stats/public — public statistics for landing page
router.get('/public', async (_req: Request, res: Response) => {
  try {
    const userCount = await userRepository.count();
    res.json({ userCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public stats' });
  }
});

export const statsRoutes = router;
