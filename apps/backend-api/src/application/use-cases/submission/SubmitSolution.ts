import type { IUseCase } from '../../interfaces/IUseCase';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { IQueueService } from '../../../domain/ports/services/IQueueService';
import type { INotificationService } from '../../../domain/ports/services/INotificationService';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { SubmitSolutionDTO, Submission } from '@interviewprep/shared-types';
import { NotFoundError } from '../../../domain/errors';

// ============================================================
// SubmitSolution Use Case
// Stores submission, enqueues for execution, notifies user
// ============================================================

interface SubmitSolutionInput extends SubmitSolutionDTO {
  userId: string;
}

export class SubmitSolution implements IUseCase<SubmitSolutionInput, Submission> {
  constructor(
    private readonly submissionRepository: ISubmissionRepository,
    private readonly problemRepository: IProblemRepository,
    private readonly queueService: IQueueService,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(input: SubmitSolutionInput): Promise<Submission> {
    // Verify problem exists
    const problem = await this.problemRepository.findById(input.problemId);
    if (!problem) {
      throw new NotFoundError('Problem', input.problemId);
    }

    // Create submission record
    const submission = await this.submissionRepository.create({
      userId: input.userId,
      problemId: input.problemId,
      code: input.code,
      language: input.language,
      status: 'PENDING',
    });

    // Increment attempt count
    await this.problemRepository.incrementAttemptCount(input.problemId);

    // Enqueue for execution
    await this.queueService.enqueueSubmission({
      submissionId: submission.id,
      userId: input.userId,
      problemId: input.problemId,
      code: input.code,
      language: input.language,
    });

    // Notify user that submission is queued
    this.notificationService.notifyUser(input.userId, 'submission:status', {
      submissionId: submission.id,
      status: 'PENDING',
    });

    return submission;
  }
}
