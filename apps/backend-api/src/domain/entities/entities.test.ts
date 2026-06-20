import { describe, it, expect } from 'vitest';
import { User, Problem, Submission, TestCase } from './index';
import { Email, Slug, Difficulty, SubmissionStatus } from '../value-objects';
import {
  UserRole,
  Category,
  Difficulty as DifficultyEnum,
  SubmissionStatus as SubmissionStatusEnum,
} from '@interviewprep/shared-types';

describe('Domain Entities', () => {
  describe('User Entity', () => {
    it('should initialize and perform operations correctly', () => {
      const email = new Email('user@example.com');
      const user = new User('user-1', 'Test User', email, UserRole.STUDENT);

      expect(user.id).toBe('user-1');
      expect(user.streak).toBe(0);
      expect(user.lastActiveAt).toBeNull();

      user.incrementStreak();
      expect(user.streak).toBe(1);
      expect(user.lastActiveAt).toBeInstanceOf(Date);

      user.resetStreak();
      expect(user.streak).toBe(0);
    });
  });

  describe('Problem Entity', () => {
    it('should initialize and compute success rates correctly', () => {
      const slug = new Slug('two-sum');
      const diff = new Difficulty(DifficultyEnum.EASY);
      const problem = new Problem(
        'problem-1',
        'Two Sum',
        slug,
        'Problem Description',
        diff,
        Category.JAVASCRIPT,
        'starter code',
      );

      expect(problem.isPublished).toBe(false);
      problem.publish();
      expect(problem.isPublished).toBe(true);

      problem.unpublish();
      expect(problem.isPublished).toBe(false);

      expect(problem.getSuccessRate()).toBe(0);

      problem.recordAttempt();
      problem.recordAttempt();
      problem.recordSuccess();

      expect(problem.attemptCount).toBe(2);
      expect(problem.solvedCount).toBe(1);
      expect(problem.getSuccessRate()).toBe(50);
    });
  });

  describe('Submission Entity', () => {
    it('should initialize and update status correctly', () => {
      const statusPending = new SubmissionStatus(SubmissionStatusEnum.PENDING);
      const statusAccepted = new SubmissionStatus(SubmissionStatusEnum.ACCEPTED);

      const submission = new Submission(
        'sub-1',
        'user-1',
        'problem-1',
        'console.log("hello");',
        'javascript',
        statusPending,
      );

      expect(submission.status.getValue()).toBe(SubmissionStatusEnum.PENDING);
      submission.updateStatus(statusAccepted);
      expect(submission.status.getValue()).toBe(SubmissionStatusEnum.ACCEPTED);
    });
  });
});
