import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetDailyChallenge } from './GetDailyChallenge';
import { NotFoundError } from '../../../domain/errors';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { ICacheService } from '../../../domain/ports/services/ICacheService';
import type { Problem, Difficulty } from '@interviewprep/shared-types';

describe('GetDailyChallenge Use Case', () => {
  let problemRepository: IProblemRepository;
  let cacheService: ICacheService;
  let useCase: GetDailyChallenge;

  const mockProblem: Problem = {
    id: 'problem-1',
    title: 'Two Sum',
    slug: 'two-sum',
    description: 'Find two numbers that add up to a target.',
    difficulty: 'EASY' as Difficulty,
    category: 'Arrays',
    starterCode: 'function twoSum() {}',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProblem2: Problem = {
    id: 'problem-2',
    title: 'Reverse a String',
    slug: 'reverse-a-string',
    description: 'Reverse a string in place.',
    difficulty: 'EASY' as Difficulty,
    category: 'Strings',
    starterCode: 'function reverseString() {}',
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

    cacheService = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      deleteByPattern: vi.fn(),
    };

    useCase = new GetDailyChallenge(problemRepository, cacheService);
  });

  it('should return cached daily challenge if present in cache', async () => {
    const targetDate = new Date('2026-06-21T12:00:00Z');
    const dateOnly = new Date(
      Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
    );
    const dateStr = dateOnly.toISOString().split('T')[0];
    const cacheKey = `problems:daily:${dateStr}`;

    vi.mocked(cacheService.get).mockResolvedValue(mockProblem);

    const result = await useCase.execute({ date: targetDate });

    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(problemRepository.getDailyChallenge).not.toHaveBeenCalled();
    expect(result).toEqual(mockProblem);
  });

  it('should query repository and return daily challenge if present in database', async () => {
    const targetDate = new Date('2026-06-21T12:00:00Z');
    const dateOnly = new Date(
      Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
    );
    const dateStr = dateOnly.toISOString().split('T')[0];
    const cacheKey = `problems:daily:${dateStr}`;

    vi.mocked(cacheService.get).mockResolvedValue(null);
    vi.mocked(problemRepository.getDailyChallenge).mockResolvedValue(mockProblem);

    const result = await useCase.execute({ date: targetDate });

    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(problemRepository.getDailyChallenge).toHaveBeenCalledWith(dateOnly);
    expect(cacheService.set).toHaveBeenCalledWith(cacheKey, mockProblem, 3600);
    expect(result).toEqual(mockProblem);
  });

  it('should create daily challenge deterministically if not set in database', async () => {
    const targetDate = new Date('2026-06-21T12:00:00Z');
    const dateOnly = new Date(
      Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
    );
    const dateStr = dateOnly.toISOString().split('T')[0];
    const cacheKey = `problems:daily:${dateStr}`;

    vi.mocked(cacheService.get).mockResolvedValue(null);
    vi.mocked(problemRepository.getDailyChallenge).mockResolvedValue(null);
    vi.mocked(problemRepository.findAll).mockResolvedValue({
      data: [mockProblem, mockProblem2],
      total: 2,
    });
    vi.mocked(problemRepository.setDailyChallenge).mockImplementation(async (id) => {
      return id === 'problem-1' ? mockProblem : mockProblem2;
    });

    const result = await useCase.execute({ date: targetDate });

    // Deterministic index check:
    // dateInt = 2026 * 10000 + 6 * 100 + 21 = 20260621
    // index = 20260621 % 2 = 1 => mockProblem2 (Reverse a String)
    expect(problemRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      isPublished: true,
    });
    expect(problemRepository.setDailyChallenge).toHaveBeenCalledWith('problem-2', dateOnly);
    expect(cacheService.set).toHaveBeenCalledWith(cacheKey, mockProblem2, 3600);
    expect(result).toEqual(mockProblem2);
  });

  it('should throw NotFoundError if no published problems are available to create a daily challenge', async () => {
    const targetDate = new Date('2026-06-21T12:00:00Z');

    vi.mocked(cacheService.get).mockResolvedValue(null);
    vi.mocked(problemRepository.getDailyChallenge).mockResolvedValue(null);
    vi.mocked(problemRepository.findAll).mockResolvedValue({
      data: [],
      total: 0,
    });

    await expect(useCase.execute({ date: targetDate })).rejects.toThrow(NotFoundError);
    expect(problemRepository.setDailyChallenge).not.toHaveBeenCalled();
  });
});
