import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(entity: string, identifier?: string) {
    const message = identifier
      ? `${entity} with identifier "${identifier}" was not found`
      : `${entity} was not found`;
    super('NOT_FOUND', message);
  }
}
