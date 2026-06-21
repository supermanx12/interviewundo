import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateProblem } from './CreateProblem';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';

describe('CreateProblem Use Case', () => {
  let problemRepository: IProblemRepository;
  let useCase: CreateProblem;

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

    useCase = new CreateProblem(problemRepository);
  });

  it('should delegate creation to the problem repository', async () => {
    const input = {
      title: 'Two Sum',
      slug: 'two-sum',
      description: 'desc',
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: 'function twoSum() {}',
      isPublished: true,
    };
    vi.mocked(problemRepository.create).mockResolvedValue({
      id: 'problem-1',
      ...input,
      tags: [],
      solvedCount: 0,
      attemptCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await useCase.execute(input);

    expect(problemRepository.create).toHaveBeenCalledWith(input);
    expect(result.slug).toBe('two-sum');
  });
});
