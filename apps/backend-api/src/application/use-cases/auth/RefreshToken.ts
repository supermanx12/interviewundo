import type { IUseCase } from '../../interfaces/IUseCase';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { IAuthTokenService } from '../../../domain/ports/services/IAuthTokenService';
import { AuthenticationError } from '../../../domain/errors';

interface RefreshTokenInput {
  refreshToken: string;
}

interface RefreshTokenOutput {
  accessToken: string;
  refreshToken: string;
}

export class RefreshToken implements IUseCase<RefreshTokenInput, RefreshTokenOutput> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authTokenService: IAuthTokenService,
  ) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    if (!input.refreshToken) {
      throw new AuthenticationError('Refresh token is required');
    }

    // 1. Verify the refresh token signature & expiry
    const payload = await this.authTokenService.verifyRefreshToken(input.refreshToken);
    
    // 2. Fetch user to ensure they still exist and check their role
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new AuthenticationError('User not found or suspended');
    }

    // 3. Generate new access and refresh tokens
    const accessToken = await this.authTokenService.generateAccessToken(user.id, user.role);
    const refreshToken = await this.authTokenService.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }
}
