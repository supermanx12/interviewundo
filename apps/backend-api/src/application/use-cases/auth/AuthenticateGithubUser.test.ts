import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticateGithubUser } from './AuthenticateGithubUser';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { IAuthTokenService } from '../../../domain/ports/services/IAuthTokenService';
import type { User, UserRole } from '@interviewprep/shared-types';

describe('AuthenticateGithubUser Use Case', () => {
  let userRepository: IUserRepository;
  let authTokenService: IAuthTokenService;
  let useCase: AuthenticateGithubUser;

  const mockUser: User = {
    id: 'user-id-123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'STUDENT' as UserRole,
    streak: 0,
    image: null,
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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

    useCase = new AuthenticateGithubUser(userRepository, authTokenService);
  });

  it('should authenticate existing github user and update name/image if changed', async () => {
    const input = {
      githubId: 'github-123',
      email: 'john@example.com',
      name: 'John Doe Changed',
      image: 'new-avatar-url',
    };

    const updatedUser = {
      ...mockUser,
      name: 'John Doe Changed',
      image: 'new-avatar-url',
    };

    vi.mocked(userRepository.findByGithubId).mockResolvedValue(mockUser);
    vi.mocked(userRepository.update).mockResolvedValue(updatedUser);
    vi.mocked(authTokenService.generateAccessToken).mockResolvedValue('access-token-abc');
    vi.mocked(authTokenService.generateRefreshToken).mockResolvedValue('refresh-token-xyz');

    const result = await useCase.execute(input);

    expect(userRepository.findByGithubId).toHaveBeenCalledWith(input.githubId);
    expect(userRepository.update).toHaveBeenCalledWith(mockUser.id, {
      name: input.name,
      image: input.image,
    });
    expect(authTokenService.generateAccessToken).toHaveBeenCalledWith(mockUser.id, mockUser.role);
    expect(authTokenService.generateRefreshToken).toHaveBeenCalledWith(mockUser.id);

    expect(result).toEqual({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        image: updatedUser.image,
      },
      accessToken: 'access-token-abc',
      refreshToken: 'refresh-token-xyz',
    });
  });

  it('should link github account to an existing email-based user', async () => {
    const input = {
      githubId: 'github-123',
      email: 'john@example.com',
      name: 'John Doe',
      image: 'avatar-url',
    };

    const linkedUser = {
      ...mockUser,
      image: 'avatar-url',
    };

    vi.mocked(userRepository.findByGithubId).mockResolvedValue(null);
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      ...mockUser,
      password: 'some-hashed-password',
    });
    vi.mocked(userRepository.update).mockResolvedValue(linkedUser);
    vi.mocked(authTokenService.generateAccessToken).mockResolvedValue('access-token-abc');
    vi.mocked(authTokenService.generateRefreshToken).mockResolvedValue('refresh-token-xyz');

    const result = await useCase.execute(input);

    expect(userRepository.findByGithubId).toHaveBeenCalledWith(input.githubId);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepository.update).toHaveBeenCalledWith(mockUser.id, {
      githubId: input.githubId,
      image: input.image,
      name: input.name,
    });
    expect(result.accessToken).toBe('access-token-abc');
  });

  it('should register a new user if no user exists by githubId or email', async () => {
    const input = {
      githubId: 'github-123',
      email: 'new@example.com',
      name: 'New User',
      image: 'avatar-url',
    };

    const newUser = {
      id: 'new-user-id',
      name: 'New User',
      email: 'new@example.com',
      role: 'STUDENT' as UserRole,
      streak: 0,
      image: 'avatar-url',
      lastActiveAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(userRepository.findByGithubId).mockResolvedValue(null);
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepository.create).mockResolvedValue(newUser);
    vi.mocked(authTokenService.generateAccessToken).mockResolvedValue('access-token-abc');
    vi.mocked(authTokenService.generateRefreshToken).mockResolvedValue('refresh-token-xyz');

    const result = await useCase.execute(input);

    expect(userRepository.findByGithubId).toHaveBeenCalledWith(input.githubId);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepository.create).toHaveBeenCalledWith({
      name: input.name,
      email: input.email,
      password: null,
      role: 'STUDENT',
      githubId: input.githubId,
      image: input.image,
    });
    expect(result.user).toEqual({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      image: newUser.image,
    });
  });
});
