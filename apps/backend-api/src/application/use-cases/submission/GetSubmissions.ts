import type { IUseCase } from '../../interfaces/IUseCase';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { Submission, SubmissionResult } from '@interviewprep/shared-types';

// ============================================================
// GetSubmissions Use Case
// Returns paginated submissions with filtering by problemId
// ============================================================

export interface GetSubmissionsInput {
  userId: string;
  problemId?: string;
  page?: number;
  limit?: number;
}

export interface GetSubmissionsOutput {
  data: Array<
    Submission & {
      problem?: {
        title: string;
        slug: string;
        difficulty: string;
      };
      result?: SubmissionResult | null;
    }
  >;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetSubmissions implements IUseCase<GetSubmissionsInput, GetSubmissionsOutput> {
  constructor(private readonly submissionRepository: ISubmissionRepository) {}

  async execute(input: GetSubmissionsInput): Promise<GetSubmissionsOutput> {
    const page = input.page || 1;
    const limit = input.limit || 20;

    const { data, total } = await this.submissionRepository.findByUser(input.userId, {
      page,
      limit,
      problemId: input.problemId,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
