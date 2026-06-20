import { ValidationError } from '../errors/ValidationError';

export class Slug {
  private readonly value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('Slug is required');
    }
    const trimmed = value.trim();
    if (!this.isValid(trimmed)) {
      throw new ValidationError(
        'Invalid slug format. Slugs must be lowercase alphanumeric and hyphens only.',
      );
    }
    this.value = trimmed;
  }

  private isValid(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Slug): boolean {
    return this.value === other.getValue();
  }
}
