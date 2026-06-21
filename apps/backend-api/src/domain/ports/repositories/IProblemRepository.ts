import type { Problem, ProblemFilterDTO } from '@interviewprep/shared-types';

// ============================================================
// IProblemRepository — Port for problem data access
// ============================================================

export interface IProblemRepository {
  create(data: {
    title: string;
    slug: string;
    description: string;
    difficulty: string;
    category: string;
    starterCode: string;
    solutionCode?: string;
    tags?: string[];
    isPublished?: boolean;
  }): Promise<Problem>;

  findById(id: string): Promise<Problem | null>;

  findBySlug(slug: string): Promise<Problem | null>;

  findAll(
    filters: ProblemFilterDTO & { isPublished?: boolean },
  ): Promise<{ data: Problem[]; total: number }>;

  update(id: string, data: Partial<Problem>): Promise<Problem>;

  delete(id: string): Promise<void>;

  incrementSolvedCount(id: string): Promise<void>;

  incrementAttemptCount(id: string): Promise<void>;

  countByDifficulty(): Promise<Record<string, number>>;

  countByCategory(): Promise<Record<string, number>>;

  countAll(): Promise<number>;

  getDailyChallenge(date: Date): Promise<Problem | null>;

  setDailyChallenge(problemId: string, date: Date): Promise<Problem>;
}
