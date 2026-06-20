import { logger } from './config/logger';
import { prisma } from './config/database';
import { redis } from './config/redis';
import { submissionWorker } from './worker/SubmissionWorker';

// ============================================================
// Judge Worker — Process Bootstrap
// ============================================================

logger.info('🏗️  Judge Worker process bootstrap initialized...');

// Graceful Shutdown Logic
async function gracefulShutdown(signal: string) {
  logger.info({ signal }, 'Received kill signal. Starting graceful shutdown...');

  try {
    // 1. Pause worker to stop accepting new jobs
    logger.info('Pausing BullMQ worker...');
    await submissionWorker.close();
    logger.info('BullMQ worker closed.');

    // 2. Disconnect Prisma
    logger.info('Disconnecting Prisma Client...');
    await prisma.$disconnect();
    logger.info('Prisma disconnected.');

    // 3. Disconnect Redis
    logger.info('Disconnecting Redis Client...');
    await redis.quit();
    logger.info('Redis disconnected.');

    logger.info('👋 Graceful shutdown complete. Exiting process.');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Error during graceful shutdown');
    process.exit(1);
  }
}

// Intercept signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled errors to log them
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'Unhandled Rejection at Promise');
});

process.on('uncaughtException', (error) => {
  logger.fatal({ error }, 'Uncaught Exception thrown');
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});
