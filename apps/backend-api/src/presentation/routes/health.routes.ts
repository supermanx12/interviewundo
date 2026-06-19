import { Router, Request, Response } from 'express';
import { prisma } from '../../config/database';
import { redis } from '../../config/redis';

// ============================================================
// Health Check Routes
// /health — basic liveness check
// /ready  — readiness check (DB + Redis connectivity)
// ============================================================

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connectivity
    await redis.ping();

    res.json({
      status: 'ready',
      services: {
        database: 'connected',
        redis: 'connected',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      services: {
        database: 'unknown',
        redis: 'unknown',
      },
    });
  }
});

export const healthRoutes = router;
