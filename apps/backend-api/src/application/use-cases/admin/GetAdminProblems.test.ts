import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetAdminProblems } from './GetAdminProblems';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';

describe('GetAdminProblems Use Case', () => {
  let problemRepository: IProblemRepository;
  let useCase: GetAdminProblems;

  beforeEach(() => {
    problemRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      incrementSolvedCount: vi.fn(),
      incrementAttemptCount: vi.fn(),
      countByDifficulty: vi.fn(),
      countByCategory: vi.fn(),
      countAll: vi.fn(),
      getDailyChallenge: vi.fn(),
      setDailyChallenge: vi.fn(),
    };

    useCase = new GetAdminProblems(problemRepository);
  });

  it('should return paginated problems for admin views', async () => {
    const filters = { page: 2, limit: 5, search: 'two', isPublished: true as const };
    vi.mocked(problemRepository.findAll).mockResolvedValue({
      data: [
        {
          id: 'problem-1',
          title: 'Two Sum',
          slug: 'two-sum',
          description: 'desc',
          difficulty: 'EASY',
          category: 'JAVASCRIPT',
          starterCode: 'function twoSum() {}',
          tags: [],
          solvedCount: 0,
          attemptCount: 0,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as any,
      total: 11,
    });

    const result = await useCase.execute(filters);

    expect(problemRepository.findAll).toHaveBeenCalledWith(filters);
    expect(result.totalPages).toBe(3);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
    expect(result.total).toBe(11);
    expect(result.data).toHaveLength(1);
  });
});
