import { Slug } from '../value-objects/Slug';
import { Difficulty } from '../value-objects/Difficulty';
import { Category } from '@interviewprep/shared-types';

export class Problem {
  constructor(
    public readonly id: string,
    public title: string,
    public slug: Slug,
    public description: string,
    public difficulty: Difficulty,
    public category: Category,
    public starterCode: string,
    public solutionCode: string | null = null,
    public tags: string[] = [],
    public order: number = 0,
    public isPublished: boolean = false,
    public solvedCount: number = 0,
    public attemptCount: number = 0,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  public publish(): void {
    this.isPublished = true;
  }

  public unpublish(): void {
    this.isPublished = false;
  }

  public recordAttempt(): void {
    this.attemptCount += 1;
  }

  public recordSuccess(): void {
    this.solvedCount += 1;
  }

  public getSuccessRate(): number {
    if (this.attemptCount === 0) return 0;
    return (this.solvedCount / this.attemptCount) * 100;
  }
}
