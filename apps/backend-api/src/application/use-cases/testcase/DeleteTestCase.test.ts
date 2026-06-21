import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteTestCase } from './DeleteTestCase';
import type { ITestCaseRepository } from '../../../domain/ports/repositories/ITestCaseRepository';
import { NotFoundError } from '../../../domain/errors';

describe('DeleteTestCase Use Case', () => {
  let testCaseRepository: ITestCaseRepository;
  let useCase: DeleteTestCase;

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

    useCase = new DeleteTestCase(testCaseRepository);
  });

  it('should throw when deleting a missing test case', async () => {
    vi.mocked(testCaseRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute({ id: 'missing-case' })).rejects.toThrow(NotFoundError);
  });

  it('should delete an existing test case', async () => {
    vi.mocked(testCaseRepository.findById).mockResolvedValue({ id: 'case-1' } as any);
    vi.mocked(testCaseRepository.delete).mockResolvedValue();

    await useCase.execute({ id: 'case-1' });

    expect(testCaseRepository.delete).toHaveBeenCalledWith('case-1');
  });
});
