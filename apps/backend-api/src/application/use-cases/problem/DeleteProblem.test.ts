import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteProblem } from './DeleteProblem';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import { NotFoundError } from '../../../domain/errors';

describe('DeleteProblem Use Case', () => {
  let problemRepository: IProblemRepository;
  let useCase: DeleteProblem;

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

    useCase = new DeleteProblem(problemRepository);
  });

  it('should throw when deleting a missing problem', async () => {
    vi.mocked(problemRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute({ id: 'missing-problem' })).rejects.toThrow(NotFoundError);
  });

  it('should delete an existing problem', async () => {
    vi.mocked(problemRepository.findById).mockResolvedValue({ id: 'problem-1' } as any);
    vi.mocked(problemRepository.delete).mockResolvedValue();

    await useCase.execute({ id: 'problem-1' });

    expect(problemRepository.delete).toHaveBeenCalledWith('problem-1');
  });
});
