import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

// ============================================================
// Redis Client — Used by BullMQ and CacheService
// ============================================================

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
});

redis.on('connect', () => {
  logger.info('✅ Redis connected');
});

redis.on('error', (err) => {
  logger.error({ err }, '❌ Redis connection error');
});
