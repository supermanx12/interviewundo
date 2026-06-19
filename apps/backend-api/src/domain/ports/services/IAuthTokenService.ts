// ============================================================
// IAuthTokenService — Port for JWT operations
// ============================================================

export interface IAuthTokenService {
  generateAccessToken(userId: string, role: string): Promise<string>;
  generateRefreshToken(userId: string): Promise<string>;
  verifyAccessToken(token: string): Promise<{ userId: string; role: string }>;
  verifyRefreshToken(token: string): Promise<{ userId: string }>;
}
