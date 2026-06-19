// ============================================================
// IPasswordService — Port for password hashing
// ============================================================

export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
