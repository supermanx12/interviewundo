import type { IUseCase } from '../../interfaces/IUseCase';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { IPasswordService } from '../../../domain/ports/services/IPasswordService';
import type { IAuthTokenService } from '../../../domain/ports/services/IAuthTokenService';
import type { RegisterDTO, AuthResponseDTO } from '@interviewprep/shared-types';
import { ConflictError } from '../../../domain/errors';

// ============================================================
// RegisterUser Use Case
// Validates input, checks for duplicates, hashes password,
// creates user, and returns tokens.
// ============================================================

export class RegisterUser implements IUseCase<RegisterDTO, AuthResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly authTokenService: IAuthTokenService,
  ) {}

  async execute(input: RegisterDTO): Promise<AuthResponseDTO> {
    const email = input.email.toLowerCase();

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('A user with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(input.password);

    // Create user
    const user = await this.userRepository.create({
      name: input.name,
      email,
      password: hashedPassword,
      role: 'STUDENT',
    });

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
