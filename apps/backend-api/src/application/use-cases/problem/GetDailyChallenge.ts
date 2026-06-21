import type { IUseCase } from '../../interfaces/IUseCase';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { ICacheService } from '../../../domain/ports/services/ICacheService';
import type { Problem } from '@interviewprep/shared-types';
import { NotFoundError } from '../../../domain/errors';

export interface GetDailyChallengeDTO {
  date?: Date;
}

export class GetDailyChallenge implements IUseCase<GetDailyChallengeDTO, Problem> {
  constructor(
    private readonly problemRepository: IProblemRepository,
    private readonly cacheService: ICacheService,
  ) {}

  async execute(dto: GetDailyChallengeDTO = {}): Promise<Problem> {
    const targetDate = dto.date || new Date();
    const dateOnly = new Date(
      Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
    );
    const dateStr = dateOnly.toISOString().split('T')[0];
    const cacheKey = `problems:daily:${dateStr}`;

    // 1. Try cache first
    const cached = await this.cacheService.get<Problem>(cacheKey);
    if (cached) return cached;

    // 2. Fetch from database
    let problem = await this.problemRepository.getDailyChallenge(dateOnly);

    // 3. If no daily challenge is set for today, create one deterministically
    if (!problem) {
      const { data: problems } = await this.problemRepository.findAll({
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        isPublished: true,
      });

      if (problems.length === 0) {
        throw new NotFoundError('Problem', 'No published problems available for daily challenge');
      }

      // Select deterministically based on date integer
      const dateInt =
        dateOnly.getFullYear() * 10000 + (dateOnly.getMonth() + 1) * 100 + dateOnly.getDate();
      const index = dateInt % problems.length;
      const selectedProblem = problems[index];

      // Persist in DB
      problem = await this.problemRepository.setDailyChallenge(selectedProblem.id, dateOnly);
    }

    // 4. Cache daily challenge for 1 hour (3600 seconds)
    await this.cacheService.set(cacheKey, problem, 3600);

    return problem;
  }
}
