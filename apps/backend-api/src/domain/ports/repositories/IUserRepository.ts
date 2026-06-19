import type { User } from '@interviewprep/shared-types';

// ============================================================
// IUserRepository — Port for user data access
// Infrastructure provides the Prisma implementation
// ============================================================

export interface IUserRepository {
  create(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User>;

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<(User & { password: string | null }) | null>;

  findByGithubId(githubId: string): Promise<User | null>;

  updateStreak(userId: string, streak: number, lastActiveAt: Date): Promise<void>;
}
