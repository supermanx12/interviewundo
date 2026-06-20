import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

// ============================================================
// Redis Connection Client for BullMQ Worker
// ============================================================

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
});

redis.on('connect', () => {
  logger.info('✅ Redis connected successfully in Judge Worker');
});

redis.on('error', (err) => {
  logger.error({ err }, '❌ Redis connection error in Judge Worker');
});
