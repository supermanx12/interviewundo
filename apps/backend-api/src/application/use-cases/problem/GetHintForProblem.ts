import type { IUseCase } from '../../interfaces/IUseCase';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { IHintUsageRepository } from '../../../domain/ports/repositories/IHintUsageRepository';
import type { IHintService } from '../../../domain/ports/services/IHintService';
import { NotFoundError, ValidationError } from '../../../domain/errors';

export interface GetHintDTO {
  userId: string;
  slug: string;
  code: string;
}

export interface HintResponseDTO {
  hint: string;
  remainingHints: number;
}

export class GetHintForProblem implements IUseCase<GetHintDTO, HintResponseDTO> {
  constructor(
    private readonly problemRepository: IProblemRepository,
    private readonly hintUsageRepository: IHintUsageRepository,
    private readonly hintService: IHintService,
  ) {}

  async execute(dto: GetHintDTO): Promise<HintResponseDTO> {
    // 1. Fetch problem
    const problem = await this.problemRepository.findBySlug(dto.slug);
    if (!problem) {
      throw new NotFoundError('Problem', dto.slug);
    }

    // 2. Count hint usage today
    const usageCount = await this.hintUsageRepository.countTodayUsage(dto.userId, problem.id);
    const LIMIT = 3;

    if (usageCount >= LIMIT) {
      throw new ValidationError('You have reached your daily limit of 3 hints for this problem.');
    }

    // 3. Generate hint
    const hint = await this.hintService.generateHint(problem.description, dto.code);

    // 4. Track hint usage in database
    await this.hintUsageRepository.create(dto.userId, problem.id);

    return {
      hint,
      remainingHints: LIMIT - (usageCount + 1),
    };
  }
}
