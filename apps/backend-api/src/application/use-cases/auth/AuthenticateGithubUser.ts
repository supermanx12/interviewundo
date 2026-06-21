import type { IUseCase } from '../../interfaces/IUseCase';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { IAuthTokenService } from '../../../domain/ports/services/IAuthTokenService';
import type { AuthResponseDTO } from '@interviewprep/shared-types';

export interface AuthenticateGithubDTO {
  githubId: string;
  email: string;
  name: string;
  image?: string | null;
}

export class AuthenticateGithubUser implements IUseCase<AuthenticateGithubDTO, AuthResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authTokenService: IAuthTokenService,
  ) {}

  async execute(input: AuthenticateGithubDTO): Promise<AuthResponseDTO> {
    // 1. Try to find user by githubId first
    let user = await this.userRepository.findByGithubId(input.githubId);

    if (user) {
      // User exists with this GitHub ID, update profile image/name if changed
      if (user.image !== input.image || user.name !== input.name) {
        user = await this.userRepository.update(user.id, {
          name: input.name,
          image: input.image || null,
        });
      }
    } else {
      // 2. Check if a user with this email already exists (originally password-based)
      const existingEmailUser = await this.userRepository.findByEmail(input.email);

      if (existingEmailUser) {
        // Link GitHub to this existing account
        user = await this.userRepository.update(existingEmailUser.id, {
          githubId: input.githubId,
          image: input.image || existingEmailUser.image || null,
          name: input.name || existingEmailUser.name,
        });
      } else {
        // 3. Register a new user
        user = await this.userRepository.create({
          name: input.name,
          email: input.email,
          password: null, // Nullable for OAuth users
          role: 'STUDENT',
          githubId: input.githubId,
          image: input.image || null,
        });
      }
    }

    // 4. Generate access and refresh tokens
    const accessToken = await this.authTokenService.generateAccessToken(user.id, user.role);
    const refreshToken = await this.authTokenService.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      accessToken,
      refreshToken,
    };
  }
}
