import { SubmissionStatus } from '../value-objects/SubmissionStatus';

export class Submission {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly problemId: string,
    public readonly code: string,
    public readonly language: string,
    public status: SubmissionStatus,
    public readonly createdAt: Date = new Date(),
  ) {}

  public updateStatus(newStatus: SubmissionStatus): void {
    this.status = newStatus;
  }
}
