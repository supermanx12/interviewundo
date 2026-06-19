import type { IUseCase } from '../../interfaces/IUseCase';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { ICacheService } from '../../../domain/ports/services/ICacheService';
import type { ProblemFilterDTO, Problem } from '@interviewprep/shared-types';

// ============================================================
// GetProblems Use Case
// Returns paginated, filtered problem list with caching
// ============================================================

interface GetProblemsOutput {
  data: Problem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetProblems implements IUseCase<ProblemFilterDTO, GetProblemsOutput> {
  constructor(
    private readonly problemRepository: IProblemRepository,
    private readonly cacheService: ICacheService,
  ) {}

  async execute(filters: ProblemFilterDTO): Promise<GetProblemsOutput> {
    // Generate cache key from filters
    const cacheKey = `problems:${JSON.stringify(filters)}`;

    // Try cache first
    const cached = await this.cacheService.get<GetProblemsOutput>(cacheKey);
    if (cached) return cached;

    // Query database
    const { data, total } = await this.problemRepository.findAll(filters);

    const result: GetProblemsOutput = {
      data,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, result, 300);

    return result;
  }
}
