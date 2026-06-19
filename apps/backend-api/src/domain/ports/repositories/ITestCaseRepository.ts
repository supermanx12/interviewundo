import type { TestCase } from '@interviewprep/shared-types';

// ============================================================
// ITestCaseRepository — Port for test case data access
// ============================================================

export interface ITestCaseRepository {
  create(data: {
    problemId: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    order?: number;
  }): Promise<TestCase>;

  findById(id: string): Promise<TestCase | null>;

  findByProblemId(problemId: string): Promise<TestCase[]>;

  findVisibleByProblemId(problemId: string): Promise<TestCase[]>;

  findHiddenByProblemId(problemId: string): Promise<TestCase[]>;

  update(id: string, data: Partial<TestCase>): Promise<TestCase>;

  delete(id: string): Promise<void>;

  deleteByProblemId(problemId: string): Promise<void>;
}
