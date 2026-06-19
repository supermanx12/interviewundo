import pino from 'pino';
import { env } from './env';

// ============================================================
// Logger — Pino (structured JSON logging)
// Uses pino-pretty in development for readable output
// ============================================================

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});
