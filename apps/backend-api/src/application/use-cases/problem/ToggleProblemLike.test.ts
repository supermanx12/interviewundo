import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToggleProblemLike } from './ToggleProblemLike';
import { NotFoundError } from '../../../domain/errors';
import { prisma } from '../../../config/database';

vi.mock('../../../config/database', () => ({
  prisma: {
    problem: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    problemLike: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(prisma)),
  },
}));

describe('ToggleProblemLike Use Case', () => {
  let useCase: ToggleProblemLike;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new ToggleProblemLike();
  });

  it('should throw NotFoundError if problem does not exist', async () => {
    vi.mocked(prisma.problem.findUnique).mockResolvedValue(null);

    await expect(useCase.execute({ userId: 'user-1', slug: 'non-existent' })).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should add like and increment likesCount if not already liked', async () => {
    vi.mocked(prisma.problem.findUnique).mockResolvedValue({
      id: 'problem-1',
      likesCount: 5,
    } as any);

    vi.mocked(prisma.problemLike.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.problem.update).mockResolvedValue({
      likesCount: 6,
    } as any);

    const result = await useCase.execute({ userId: 'user-1', slug: 'two-sum' });

    expect(prisma.problemLike.create).toHaveBeenCalledWith({
      data: { userId: 'user-1', problemId: 'problem-1' },
    });
    expect(prisma.problem.update).toHaveBeenCalledWith({
      where: { id: 'problem-1' },
      data: { likesCount: { increment: 1 } },
      select: { likesCount: true },
    });
    expect(result).toEqual({ liked: true, likesCount: 6 });
  });

  it('should remove like and decrement likesCount if already liked', async () => {
    vi.mocked(prisma.problem.findUnique).mockResolvedValue({
      id: 'problem-1',
      likesCount: 5,
    } as any);

    vi.mocked(prisma.problemLike.findUnique).mockResolvedValue({
      id: 'like-1',
      userId: 'user-1',
      problemId: 'problem-1',
    } as any);
    vi.mocked(prisma.problem.update).mockResolvedValue({
      likesCount: 4,
    } as any);

    const result = await useCase.execute({ userId: 'user-1', slug: 'two-sum' });

    expect(prisma.problemLike.delete).toHaveBeenCalledWith({
      where: { id: 'like-1' },
    });
    expect(prisma.problem.update).toHaveBeenCalledWith({
      where: { id: 'problem-1' },
      data: { likesCount: { decrement: 1 } },
      select: { likesCount: true },
    });
    expect(result).toEqual({ liked: false, likesCount: 4 });
  });
});
