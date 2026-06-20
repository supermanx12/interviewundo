import { Email } from '../value-objects/Email';
import { UserRole } from '@interviewprep/shared-types';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: Email,
    public role: UserRole,
    public image: string | null = null,
    public streak: number = 0,
    public lastActiveAt: Date | null = null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  public incrementStreak(): void {
    this.streak += 1;
    this.lastActiveAt = new Date();
  }

  public resetStreak(): void {
    this.streak = 0;
  }

  public updateActivity(): void {
    this.lastActiveAt = new Date();
  }
}
