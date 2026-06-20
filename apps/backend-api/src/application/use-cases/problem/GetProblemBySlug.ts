import type { IUseCase } from '../../interfaces/IUseCase';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { ICacheService } from '../../../domain/ports/services/ICacheService';
import type { Problem } from '@interviewprep/shared-types';
import { NotFoundError } from '../../../domain/errors';

export class GetProblemBySlug implements IUseCase<string, Problem> {
  constructor(
    private readonly problemRepository: IProblemRepository,
    private readonly cacheService: ICacheService,
  ) {}

  async execute(slug: string): Promise<Problem> {
    const cacheKey = `problems:slug:${slug}`;

    // 1. Try cache first
    const cached = await this.cacheService.get<Problem>(cacheKey);
    if (cached) return cached;

    // 2. Fetch from database
    const problem = await this.problemRepository.findBySlug(slug);
    if (!problem) {
      throw new NotFoundError('Problem', slug);
    }

    // 3. Cache for 5 minutes (300 seconds)
    await this.cacheService.set(cacheKey, problem, 300);

    return problem;
  }
}
