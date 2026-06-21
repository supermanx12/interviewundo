import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RefreshToken } from './RefreshToken';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { IAuthTokenService } from '../../../domain/ports/services/IAuthTokenService';
import type { UserRole } from '@interviewprep/shared-types';
import { AuthenticationError } from '../../../domain/errors';

describe('RefreshToken Use Case', () => {
  let userRepository: IUserRepository;
  let authTokenService: IAuthTokenService;
  let useCase: RefreshToken;

  beforeEach(() => {
    userRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findByGithubId: vi.fn(),
      updateStreak: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    };

    authTokenService = {
      generateAccessToken: vi.fn(),
      generateRefreshToken: vi.fn(),
      verifyAccessToken: vi.fn(),
      verifyRefreshToken: vi.fn(),
    };

    useCase = new RefreshToken(userRepository, authTokenService);
  });

  it('should reject empty refresh tokens', async () => {
    await expect(useCase.execute({ refreshToken: '' })).rejects.toThrow(AuthenticationError);
  });

  it('should reject refresh tokens for missing users', async () => {
    vi.mocked(authTokenService.verifyRefreshToken).mockResolvedValue({ userId: 'user-1' });
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute({ refreshToken: 'refresh-token' })).rejects.toThrow(
      'User not found or suspended',
    );
  });

  it('should issue new access and refresh tokens for existing users', async () => {
    vi.mocked(authTokenService.verifyRefreshToken).mockResolvedValue({ userId: 'user-1' });
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'STUDENT' as UserRole,
      streak: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(authTokenService.generateAccessToken).mockResolvedValue('new-access-token');
    vi.mocked(authTokenService.generateRefreshToken).mockResolvedValue('new-refresh-token');

    const result = await useCase.execute({ refreshToken: 'refresh-token' });

    expect(authTokenService.verifyRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(authTokenService.generateAccessToken).toHaveBeenCalledWith('user-1', 'STUDENT');
    expect(authTokenService.generateRefreshToken).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
  });
});
