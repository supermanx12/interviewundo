import { ValidationError } from '../errors/ValidationError';
import { SubmissionStatus as SubmissionStatusEnum } from '@interviewprep/shared-types';

export class SubmissionStatus {
  private readonly value: SubmissionStatusEnum;

  constructor(value: any) {
    if (!value) {
      throw new ValidationError('Submission status is required');
    }
    if (!Object.values(SubmissionStatusEnum).includes(value)) {
      throw new ValidationError(`Invalid submission status: ${value}`);
    }
    this.value = value as SubmissionStatusEnum;
  }

  public getValue(): SubmissionStatusEnum {
    return this.value;
  }

  public equals(other: SubmissionStatus): boolean {
    return this.value === other.getValue();
  }
}
