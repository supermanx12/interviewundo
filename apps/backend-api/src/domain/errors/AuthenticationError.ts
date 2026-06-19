import { DomainError } from './DomainError';

export class AuthenticationError extends DomainError {
  constructor(message: string = 'Invalid credentials') {
    super('INVALID_CREDENTIALS', message);
  }
}
