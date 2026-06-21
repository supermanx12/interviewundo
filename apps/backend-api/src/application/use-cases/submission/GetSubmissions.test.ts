import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetSubmissions } from './GetSubmissions';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { Submission, SubmissionStatus } from '@interviewprep/shared-types';

describe('GetSubmissions Use Case', () => {
  let submissionRepository: ISubmissionRepository;
  let useCase: GetSubmissions;

  const mockSubmissions: Submission[] = [
    {
      id: 'sub-1',
      userId: 'user-123',
      problemId: 'problem-1',
      code: 'code1',
      language: 'javascript',
      status: 'ACCEPTED' as SubmissionStatus,
      createdAt: new Date(),
    },
    {
      id: 'sub-2',
      userId: 'user-123',
      problemId: 'problem-2',
      code: 'code2',
      language: 'javascript',
      status: 'WRONG_ANSWER' as SubmissionStatus,
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    submissionRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUser: vi.fn(),
      findByUserAndProblem: vi.fn(),
      updateStatus: vi.fn(),
      createResult: vi.fn(),
      countByUser: vi.fn(),
      countSolvedByUser: vi.fn(),
      countAcceptedByUser: vi.fn(),
      getSolvedProblemsDifficultyByUser: vi.fn(),
      getSolvedProblemsCategoryByUser: vi.fn(),
      getRecentActivityByUser: vi.fn(),
      getActivityByUser: vi.fn(),
    };

    useCase = new GetSubmissions(submissionRepository);
  });

  it('should retrieve user submissions successfully with default pagination', async () => {
    const input = { userId: 'user-123' };

    vi.mocked(submissionRepository.findByUser).mockResolvedValue({
      data: mockSubmissions,
      total: 2,
    });

    const result = await useCase.execute(input);

    expect(submissionRepository.findByUser).toHaveBeenCalledWith('user-123', {
      page: 1,
      limit: 20,
    });

    expect(result).toEqual({
      data: mockSubmissions,
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
  });

  it('should respect custom page and limit parameters', async () => {
    const input = { userId: 'user-123', page: 2, limit: 5 };

    vi.mocked(submissionRepository.findByUser).mockResolvedValue({
      data: [],
      total: 12,
    });

    const result = await useCase.execute(input);

    expect(submissionRepository.findByUser).toHaveBeenCalledWith('user-123', {
      page: 2,
      limit: 5,
    });

    expect(result).toEqual({
      data: [],
      total: 12,
      page: 2,
      limit: 5,
      totalPages: 3, // Math.ceil(12 / 5) = 3
    });
  });
});
