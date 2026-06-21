import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetHintForProblem } from './GetHintForProblem';
import { ValidationError, NotFoundError } from '../../../domain/errors';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { IHintUsageRepository } from '../../../domain/ports/repositories/IHintUsageRepository';
import type { IHintService } from '../../../domain/ports/services/IHintService';
import type { Problem, Difficulty } from '@interviewprep/shared-types';

describe('GetHintForProblem Use Case', () => {
  let problemRepository: IProblemRepository;
  let hintUsageRepository: IHintUsageRepository;
  let hintService: IHintService;
  let useCase: GetHintForProblem;

  const mockProblem: Problem = {
    id: 'problem-1',
    title: 'Two Sum',
    slug: 'two-sum',
    description: 'Find two numbers that add up to target.',
    difficulty: 'EASY' as Difficulty,
    category: 'Arrays',
    starterCode: 'function twoSum() {}',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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

    hintUsageRepository = {
      countTodayUsage: vi.fn(),
      create: vi.fn(),
    };

    hintService = {
      generateHint: vi.fn(),
    };

    useCase = new GetHintForProblem(problemRepository, hintUsageRepository, hintService);
  });

  it('should generate a hint successfully when under the limit', async () => {
    const dto = {
      userId: 'user-123',
      slug: 'two-sum',
      code: 'function twoSum() { }',
    };

    vi.mocked(problemRepository.findBySlug).mockResolvedValue(mockProblem);
    vi.mocked(hintUsageRepository.countTodayUsage).mockResolvedValue(1);
    vi.mocked(hintService.generateHint).mockResolvedValue('Try using a Hash Map to store indices.');

    const result = await useCase.execute(dto);

    expect(problemRepository.findBySlug).toHaveBeenCalledWith('two-sum');
    expect(hintUsageRepository.countTodayUsage).toHaveBeenCalledWith('user-123', 'problem-1');
    expect(hintService.generateHint).toHaveBeenCalledWith(mockProblem.description, dto.code);
    expect(hintUsageRepository.create).toHaveBeenCalledWith('user-123', 'problem-1');

    expect(result).toEqual({
      hint: 'Try using a Hash Map to store indices.',
      remainingHints: 1, // 3 - (1 + 1) = 1
    });
  });

  it('should throw ValidationError if the user reaches the daily limit', async () => {
    const dto = {
      userId: 'user-123',
      slug: 'two-sum',
      code: 'function twoSum() { }',
    };

    vi.mocked(problemRepository.findBySlug).mockResolvedValue(mockProblem);
    vi.mocked(hintUsageRepository.countTodayUsage).mockResolvedValue(3);

    await expect(useCase.execute(dto)).rejects.toThrow(ValidationError);
    await expect(useCase.execute(dto)).rejects.toThrow(
      'You have reached your daily limit of 3 hints for this problem.',
    );

    expect(hintService.generateHint).not.toHaveBeenCalled();
    expect(hintUsageRepository.create).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError if the problem does not exist', async () => {
    const dto = {
      userId: 'user-123',
      slug: 'non-existent',
      code: 'function twoSum() { }',
    };

    vi.mocked(problemRepository.findBySlug).mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundError);
    expect(hintUsageRepository.countTodayUsage).not.toHaveBeenCalled();
    expect(hintService.generateHint).not.toHaveBeenCalled();
  });
});
