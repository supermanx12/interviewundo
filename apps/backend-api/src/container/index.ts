// ============================================================
// Dependency Injection Container
// Wires infrastructure implementations to domain ports
// All use cases are instantiated here and exported
// ============================================================

// --- Infrastructure (implementations) ---
import { PrismaUserRepository } from '../infrastructure/database/repositories/PrismaUserRepository';
import { PrismaProblemRepository } from '../infrastructure/database/repositories/PrismaProblemRepository';
import { JoseAuthTokenService } from '../infrastructure/auth/JoseAuthTokenService';
import { Argon2PasswordService } from '../infrastructure/auth/Argon2PasswordService';
import { RedisCacheService } from '../infrastructure/cache/RedisCacheService';

// --- Use Cases ---
import { RegisterUser } from '../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../application/use-cases/auth/LoginUser';
import { RefreshToken } from '../application/use-cases/auth/RefreshToken';
import { GetProblems } from '../application/use-cases/problem/GetProblems';
import { GetProblemBySlug } from '../application/use-cases/problem/GetProblemBySlug';

// --- Controllers ---
import { AuthController } from '../presentation/controllers/AuthController';
import { ProblemController } from '../presentation/controllers/ProblemController';

// ============================================================
// Wire Dependencies
// ============================================================

// Step 1: Instantiate infrastructure
const userRepository = new PrismaUserRepository();
const problemRepository = new PrismaProblemRepository();
const authTokenService = new JoseAuthTokenService();
const passwordService = new Argon2PasswordService();
const cacheService = new RedisCacheService();

// Step 2: Instantiate use cases with injected dependencies
const registerUser = new RegisterUser(userRepository, passwordService, authTokenService);
const loginUser = new LoginUser(userRepository, passwordService, authTokenService);
const refreshToken = new RefreshToken(userRepository, authTokenService);
const getProblems = new GetProblems(problemRepository, cacheService);
const getProblemBySlug = new GetProblemBySlug(problemRepository, cacheService);

// Step 3: Instantiate controllers
const authController = new AuthController(registerUser, loginUser, refreshToken);
const problemController = new ProblemController(getProblems, getProblemBySlug);

// Step 4: Export container
export const container = {
  repositories: {
    userRepository,
    problemRepository,
  },
  services: {
    authTokenService,
    passwordService,
    cacheService,
  },
  useCases: {
    registerUser,
    loginUser,
    refreshToken,
    getProblems,
    getProblemBySlug,
  },
  controllers: {
    authController,
    problemController,
  },
};
