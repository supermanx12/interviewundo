import { describe, it, expect } from 'vitest';
import { Email, Slug, Difficulty, SubmissionStatus } from './index';
import { ValidationError } from '../errors/ValidationError';
import {
  Difficulty as DifficultyEnum,
  SubmissionStatus as SubmissionStatusEnum,
} from '@interviewprep/shared-types';

describe('Domain Value Objects', () => {
  describe('Email', () => {
    it('should create email instance with valid email address', () => {
      const email = new Email('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should trim and lowercase email address', () => {
      const email = new Email('  User@Example.COM  ');
      expect(email.getValue()).toBe('user@example.com');
    });

    it('should throw ValidationError for invalid email addresses', () => {
      expect(() => new Email('invalid-email')).toThrow(ValidationError);
      expect(() => new Email('@example.com')).toThrow(ValidationError);
      expect(() => new Email('test@')).toThrow(ValidationError);
      expect(() => new Email('')).toThrow(ValidationError);
    });

    it('should support equality comparison', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('  TEST@example.com ');
      const email3 = new Email('other@example.com');

      expect(email1.equals(email2)).toBe(true);
      expect(email1.equals(email3)).toBe(false);
    });
  });

  describe('Slug', () => {
    it('should create slug instance with valid slug format', () => {
      const slug = new Slug('two-sum');
      expect(slug.getValue()).toBe('two-sum');
    });

    it('should allow numbers and single hyphens in slug', () => {
      const slug = new Slug('3sum-problem-123');
      expect(slug.getValue()).toBe('3sum-problem-123');
    });

    it('should throw ValidationError for invalid slug formats', () => {
      expect(() => new Slug('Two-Sum')).toThrow(ValidationError); // Uppercase not allowed
      expect(() => new Slug('two--sum')).toThrow(ValidationError); // Double hyphens not allowed
      expect(() => new Slug('two sum')).toThrow(ValidationError); // Spaces not allowed
      expect(() => new Slug('two-sum-')).toThrow(ValidationError); // Trailing hyphen not allowed
      expect(() => new Slug('')).toThrow(ValidationError);
    });

    it('should support equality comparison', () => {
      const slug1 = new Slug('two-sum');
      const slug2 = new Slug('two-sum');
      const slug3 = new Slug('three-sum');

      expect(slug1.equals(slug2)).toBe(true);
      expect(slug1.equals(slug3)).toBe(false);
    });
  });

  describe('Difficulty', () => {
    it('should create difficulty with valid enum value', () => {
      const diff = new Difficulty(DifficultyEnum.EASY);
      expect(diff.getValue()).toBe('EASY');
    });

    it('should throw ValidationError for invalid difficulty values', () => {
      expect(() => new Difficulty('VERY_EASY')).toThrow(ValidationError);
      expect(() => new Difficulty('')).toThrow(ValidationError);
    });

    it('should support equality comparison', () => {
      const diff1 = new Difficulty(DifficultyEnum.EASY);
      const diff2 = new Difficulty(DifficultyEnum.EASY);
      const diff3 = new Difficulty(DifficultyEnum.HARD);

      expect(diff1.equals(diff2)).toBe(true);
      expect(diff1.equals(diff3)).toBe(false);
    });
  });

  describe('SubmissionStatus', () => {
    it('should create status with valid enum value', () => {
      const status = new SubmissionStatus(SubmissionStatusEnum.ACCEPTED);
      expect(status.getValue()).toBe('ACCEPTED');
    });

    it('should throw ValidationError for invalid status values', () => {
      expect(() => new SubmissionStatus('QUEUED')).toThrow(ValidationError);
      expect(() => new SubmissionStatus('')).toThrow(ValidationError);
    });

    it('should support equality comparison', () => {
      const status1 = new SubmissionStatus(SubmissionStatusEnum.ACCEPTED);
      const status2 = new SubmissionStatus(SubmissionStatusEnum.ACCEPTED);
      const status3 = new SubmissionStatus(SubmissionStatusEnum.WRONG_ANSWER);

      expect(status1.equals(status2)).toBe(true);
      expect(status1.equals(status3)).toBe(false);
    });
  });
});
