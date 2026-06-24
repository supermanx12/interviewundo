import type { IUseCase } from '../../interfaces/IUseCase';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { IAuthTokenService } from '../../../domain/ports/services/IAuthTokenService';
import type { AuthResponseDTO } from '@interviewprep/shared-types';

export interface AuthenticateGoogleDTO {
  googleId: string;
  email: string;
  name: string;
  image?: string | null;
}

export class AuthenticateGoogleUser implements IUseCase<AuthenticateGoogleDTO, AuthResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authTokenService: IAuthTokenService,
  ) {}

  async execute(input: AuthenticateGoogleDTO): Promise<AuthResponseDTO> {
    // 1. Try to find user by googleId first
    let user = await this.userRepository.findByGoogleId(input.googleId);

    if (user) {
      // User exists with this Google ID, update profile image/name if changed
      if (user.image !== input.image || user.name !== input.name) {
        user = await this.userRepository.update(user.id, {
          name: input.name,
          image: input.image || null,
        });
      }
    } else {
      // 2. Check if a user with this email already exists (originally password-based or GitHub)
      const email = input.email.toLowerCase();
      const existingEmailUser = await this.userRepository.findByEmail(email);

      if (existingEmailUser) {
        // Link Google to this existing account
        user = await this.userRepository.update(existingEmailUser.id, {
          googleId: input.googleId,
          image: input.image || existingEmailUser.image || null,
          name: input.name || existingEmailUser.name,
        });
      } else {
        // 3. Register a new user
        user = await this.userRepository.create({
          name: input.name,
          email,
          password: null, // Nullable for OAuth users
          role: 'STUDENT',
          googleId: input.googleId,
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
