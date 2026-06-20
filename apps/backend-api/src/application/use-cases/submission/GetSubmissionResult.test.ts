import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetSubmissionResult } from './GetSubmissionResult';
import { NotFoundError, AuthorizationError } from '../../../domain/errors';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { Submission, SubmissionResult, SubmissionStatus } from '@interviewprep/shared-types';

describe('GetSubmissionResult Use Case', () => {
  let submissionRepository: ISubmissionRepository;
  let useCase: GetSubmissionResult;

  const mockResult: SubmissionResult = {
    id: 'res-999',
    submissionId: 'sub-123',
    passedCases: 10,
    totalCases: 10,
    runtime: 50,
    memory: 20000,
    createdAt: new Date(),
  };

  const mockSubmission: Submission & { result?: SubmissionResult | null } = {
    id: 'sub-123',
    userId: 'user-123',
    problemId: 'problem-1',
    code: 'console.log("ok");',
    language: 'javascript',
    status: 'ACCEPTED' as SubmissionStatus,
    createdAt: new Date(),
    result: mockResult,
  };

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
      getActivityByUser: vi.fn(),
    };

    useCase = new GetSubmissionResult(submissionRepository);
  });

  it('should retrieve submission and result successfully if user owns the submission', async () => {
    const input = { userId: 'user-123', submissionId: 'sub-123' };

    vi.mocked(submissionRepository.findById).mockResolvedValue(mockSubmission);

    const result = await useCase.execute(input);

    expect(submissionRepository.findById).toHaveBeenCalledWith('sub-123');
    expect(result).toEqual(mockSubmission);
  });

  it('should throw NotFoundError if submission is not found', async () => {
    const input = { userId: 'user-123', submissionId: 'non-existent' };

    vi.mocked(submissionRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(input)).rejects.toThrow(
      'Submission with identifier "non-existent" was not found',
    );

    expect(submissionRepository.findById).toHaveBeenCalledWith('non-existent');
  });

  it('should throw AuthorizationError if user does not own the submission', async () => {
    const input = { userId: 'stranger-user', submissionId: 'sub-123' };

    vi.mocked(submissionRepository.findById).mockResolvedValue(mockSubmission);

    await expect(useCase.execute(input)).rejects.toThrow(AuthorizationError);
    await expect(useCase.execute(input)).rejects.toThrow(
      'You do not have permission to view this submission result',
    );

    expect(submissionRepository.findById).toHaveBeenCalledWith('sub-123');
  });
});
