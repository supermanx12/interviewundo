// ============================================================
// IQueueService — Port for job queue operations
// ============================================================

export interface SubmissionJob {
  submissionId: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
}

export interface IQueueService {
  enqueueSubmission(job: SubmissionJob): Promise<string>; // Returns job ID
  getJobStatus(jobId: string): Promise<string | null>;
}
