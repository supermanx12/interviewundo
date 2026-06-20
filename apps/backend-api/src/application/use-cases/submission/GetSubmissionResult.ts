import type { IUseCase } from '../../interfaces/IUseCase';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { Submission, SubmissionResult } from '@interviewprep/shared-types';
import { NotFoundError, AuthorizationError } from '../../../domain/errors';

export interface GetSubmissionResultInput {
  userId: string;
  submissionId: string;
}

export type GetSubmissionResultOutput = Submission & {
  result?: SubmissionResult | null;
};

export class GetSubmissionResult implements IUseCase<
  GetSubmissionResultInput,
  GetSubmissionResultOutput
> {
  constructor(private readonly submissionRepository: ISubmissionRepository) {}

  async execute(input: GetSubmissionResultInput): Promise<GetSubmissionResultOutput> {
    const submission = await this.submissionRepository.findById(input.submissionId);
    if (!submission) {
      throw new NotFoundError('Submission', input.submissionId);
    }

    // Security check: users can only view their own submissions
    if (submission.userId !== input.userId) {
      throw new AuthorizationError('You do not have permission to view this submission result');
    }

    return submission;
  }
}
