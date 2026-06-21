import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DailyChallengeCron } from './DailyChallengeCron';
import cron from 'node-cron';
import { container } from '../../container';

vi.mock('node-cron', () => ({
  default: {
    schedule: vi.fn((_expression, callback) => {
      // Return a dummy scheduled task
      return { start: vi.fn(), stop: vi.fn() };
    }),
  },
}));

vi.mock('../../container', () => ({
  container: {
    useCases: {
      getDailyChallenge: {
        execute: vi.fn(),
      },
    },
  },
}));

describe('DailyChallengeCron Background Task', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should run daily challenge checks on startup and schedule recurring cron job at midnight', async () => {
    vi.mocked(container.useCases.getDailyChallenge.execute).mockResolvedValue({
      id: 'problem-1',
      title: 'Two Sum',
      slug: 'two-sum',
    } as any);

    DailyChallengeCron.start();

    // 1. Startup check should run immediately
    expect(container.useCases.getDailyChallenge.execute).toHaveBeenCalled();

    // 2. Cron schedule should be registered
    expect(cron.schedule).toHaveBeenCalledWith('0 0 * * *', expect.any(Function));

    // 3. Trigger scheduled cron task callback
    const cronCallback = vi.mocked(cron.schedule).mock.calls[0][1];
    await cronCallback();

    // Verify it runs again
    expect(container.useCases.getDailyChallenge.execute).toHaveBeenCalledTimes(2);
  });
});
