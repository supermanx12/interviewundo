import type { IUseCase } from '../../interfaces/IUseCase';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { IPasswordService } from '../../../domain/ports/services/IPasswordService';
import type { IAuthTokenService } from '../../../domain/ports/services/IAuthTokenService';
import type { LoginDTO, AuthResponseDTO } from '@interviewprep/shared-types';
import { AuthenticationError } from '../../../domain/errors';

// ============================================================
// LoginUser Use Case
// ============================================================

export class LoginUser implements IUseCase<LoginDTO, AuthResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly authTokenService: IAuthTokenService,
  ) {}

  async execute(input: LoginDTO): Promise<AuthResponseDTO> {
    const email = input.email.toLowerCase();
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.passwordService.compare(input.password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
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
