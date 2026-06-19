import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  public readonly details?: Array<{ field: string; message: string }>;

  constructor(message: string, details?: Array<{ field: string; message: string }>) {
    super('VALIDATION_ERROR', message);
    this.details = details;
  }
}
