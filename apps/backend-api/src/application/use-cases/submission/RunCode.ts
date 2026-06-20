import crypto from 'crypto';
import type { IUseCase } from '../../interfaces/IUseCase';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { IQueueService } from '../../../domain/ports/services/IQueueService';
import type { RunCodeDTO } from '@interviewprep/shared-types';
import { NotFoundError } from '../../../domain/errors';

export interface RunCodeInput extends RunCodeDTO {
  userId: string;
}

export interface RunCodeOutput {
  jobId: string;
  status: string;
}

export class RunCode implements IUseCase<RunCodeInput, RunCodeOutput> {
  constructor(
    private readonly problemRepository: IProblemRepository,
    private readonly queueService: IQueueService,
  ) {}

  async execute(input: RunCodeInput): Promise<RunCodeOutput> {
    // 1. Verify problem exists
    const problem = await this.problemRepository.findById(input.problemId);
    if (!problem) {
      throw new NotFoundError('Problem', input.problemId);
    }

    // 2. Generate a temporary execution job ID
    const jobId = `run-${crypto.randomUUID()}`;

    // 3. Enqueue in the job queue for processing (playground mode)
    await this.queueService.enqueueSubmission({
      submissionId: jobId, // Uses generated run ID instead of a database submission ID
      userId: input.userId,
      problemId: input.problemId,
      code: input.code,
      language: input.language,
    });

    return {
      jobId,
      status: 'PENDING',
    };
  }
}
