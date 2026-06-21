import { prisma } from '../../../config/database';
import type { IHintUsageRepository } from '../../../domain/ports/repositories/IHintUsageRepository';

// ============================================================
// PrismaHintUsageRepository
// Concrete repository implementing HintUsage database operations
// ============================================================

export class PrismaHintUsageRepository implements IHintUsageRepository {
  async countTodayUsage(userId: string, problemId: string): Promise<number> {
    const today = new Date();
    const startOfDay = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0),
    );

    return prisma.hintUsage.count({
      where: {
        userId,
        problemId,
        createdAt: {
          gte: startOfDay,
        },
      },
    });
  }

  async create(userId: string, problemId: string): Promise<void> {
    await prisma.hintUsage.create({
      data: {
        userId,
        problemId,
      },
    });
  }
}
