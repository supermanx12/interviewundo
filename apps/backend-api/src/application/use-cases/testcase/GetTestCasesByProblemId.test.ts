import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetTestCasesByProblemId } from './GetTestCasesByProblemId';
import type { ITestCaseRepository } from '../../../domain/ports/repositories/ITestCaseRepository';

describe('GetTestCasesByProblemId Use Case', () => {
  let testCaseRepository: ITestCaseRepository;
  let useCase: GetTestCasesByProblemId;

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

    useCase = new GetTestCasesByProblemId(testCaseRepository);
  });

  it('should return all test cases for a problem', async () => {
    vi.mocked(testCaseRepository.findByProblemId).mockResolvedValue([
      { id: 'case-1', problemId: 'problem-1' },
      { id: 'case-2', problemId: 'problem-1' },
    ] as any);

    const result = await useCase.execute('problem-1');

    expect(testCaseRepository.findByProblemId).toHaveBeenCalledWith('problem-1');
    expect(result).toHaveLength(2);
  });
});
