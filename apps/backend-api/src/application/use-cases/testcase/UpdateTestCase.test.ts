import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdateTestCase } from './UpdateTestCase';
import type { ITestCaseRepository } from '../../../domain/ports/repositories/ITestCaseRepository';
import { NotFoundError } from '../../../domain/errors';

describe('UpdateTestCase Use Case', () => {
  let testCaseRepository: ITestCaseRepository;
  let useCase: UpdateTestCase;

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

    useCase = new UpdateTestCase(testCaseRepository);
  });

  it('should throw when updating a missing test case', async () => {
    vi.mocked(testCaseRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute({ id: 'missing-case', data: { isHidden: true } })).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should update an existing test case', async () => {
    vi.mocked(testCaseRepository.findById).mockResolvedValue({ id: 'case-1' } as any);
    vi.mocked(testCaseRepository.update).mockResolvedValue({
      id: 'case-1',
      isHidden: true,
    } as any);

    const result = await useCase.execute({ id: 'case-1', data: { isHidden: true } });

    expect(testCaseRepository.update).toHaveBeenCalledWith('case-1', { isHidden: true });
    expect(result.isHidden).toBe(true);
  });
});
