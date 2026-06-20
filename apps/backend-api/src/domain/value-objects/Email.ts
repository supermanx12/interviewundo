import { ValidationError } from '../errors/ValidationError';

export class Email {
  private readonly value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('Email is required');
    }
    const trimmed = value.trim();
    if (!this.isValid(trimmed)) {
      throw new ValidationError('Invalid email format');
    }
    this.value = trimmed.toLowerCase();
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.getValue();
  }
}
