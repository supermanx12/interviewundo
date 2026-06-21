import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdateProblem } from './UpdateProblem';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import { NotFoundError } from '../../../domain/errors';

describe('UpdateProblem Use Case', () => {
  let problemRepository: IProblemRepository;
  let useCase: UpdateProblem;

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

    useCase = new UpdateProblem(problemRepository);
  });

  it('should throw when the problem does not exist', async () => {
    vi.mocked(problemRepository.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'missing-problem', data: { title: 'Updated' } }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should update an existing problem', async () => {
    vi.mocked(problemRepository.findById).mockResolvedValue({ id: 'problem-1' } as any);
    vi.mocked(problemRepository.update).mockResolvedValue({
      id: 'problem-1',
      title: 'Updated',
    } as any);

    const result = await useCase.execute({ id: 'problem-1', data: { title: 'Updated' } });

    expect(problemRepository.update).toHaveBeenCalledWith('problem-1', { title: 'Updated' });
    expect(result.title).toBe('Updated');
  });
});
