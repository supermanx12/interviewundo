import cron from 'node-cron';
import { logger } from '../../config/logger';
import { container } from '../../container';

// ============================================================
// DailyChallengeCron
// Background service that manages daily challenge scheduling
// ============================================================

export class DailyChallengeCron {
  static start(): void {
    // Run once on startup to ensure today's challenge is pre-populated
    this.rotateChallenge();

    // Schedule rotation to run every day at midnight (local server time)
    // Cron format: 'minute hour day-of-month month day-of-week'
    cron.schedule('0 0 * * *', async () => {
      logger.info('⏰ Running scheduled daily challenge rotation...');
      await this.rotateChallenge();
    });

    logger.info('🚀 Daily challenge rotation cron job scheduled (runs daily at 00:00).');
  }

  private static async rotateChallenge(): Promise<void> {
    try {
      const problem = await container.useCases.getDailyChallenge.execute({ date: new Date() });
      logger.info(
        `✨ Daily challenge check/rotation completed. Today's problem: "${problem.title}" (slug: ${problem.slug})`,
      );
    } catch (error: any) {
      logger.error('❌ Daily challenge rotation failed:', error);
    }
  }
}
