import { DomainError } from './DomainError';

export class AuthorizationError extends DomainError {
  constructor(message: string = 'You do not have permission to perform this action') {
    super('FORBIDDEN', message);
  }
}
