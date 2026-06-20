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

export const redisSubscriber = new Redis(env.REDIS_URL, {
  enableReadyCheck: false,
});

redisSubscriber.on('connect', () => {
  logger.info('✅ Redis subscriber connected');
});

redisSubscriber.on('error', (err) => {
  logger.error({ err }, '❌ Redis subscriber connection error');
});
