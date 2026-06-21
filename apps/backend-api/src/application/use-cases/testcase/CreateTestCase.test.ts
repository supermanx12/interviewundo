import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateTestCase } from './CreateTestCase';
import type { ITestCaseRepository } from '../../../domain/ports/repositories/ITestCaseRepository';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import { NotFoundError } from '../../../domain/errors';

describe('CreateTestCase Use Case', () => {
  let testCaseRepository: ITestCaseRepository;
  let problemRepository: IProblemRepository;
  let useCase: CreateTestCase;

  beforeEach(() => {
    testCaseRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByProblemId: vi.fn(),
      findVisibleByProblemId: vi.fn(),
      findHiddenByProblemId: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteByProblemId: vi.fn(),
    };

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

    useCase = new CreateTestCase(testCaseRepository, problemRepository);
  });

  it('should reject test cases for missing problems', async () => {
    vi.mocked(problemRepository.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({
        problemId: 'problem-1',
        input: '[1,2]',
        expectedOutput: '[0,1]',
        isHidden: false,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should create a test case for an existing problem', async () => {
    const input = {
      problemId: 'problem-1',
      input: '[1,2]',
      expectedOutput: '[0,1]',
      isHidden: false,
      order: 1,
    };
    vi.mocked(problemRepository.findById).mockResolvedValue({ id: 'problem-1' } as any);
    vi.mocked(testCaseRepository.create).mockResolvedValue({ id: 'case-1', ...input } as any);

    const result = await useCase.execute(input);

    expect(testCaseRepository.create).toHaveBeenCalledWith(input);
    expect(result.id).toBe('case-1');
  });
});
