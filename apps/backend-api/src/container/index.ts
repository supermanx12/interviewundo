// ============================================================
// Dependency Injection Container
// Wires infrastructure implementations to domain ports
// All use cases are instantiated here and exported
// ============================================================

// --- Infrastructure (implementations) ---
// TODO: Uncomment as implementations are built in Sprint 1-2

// import { PrismaUserRepository } from '../infrastructure/database/repositories/PrismaUserRepository';
// import { PrismaProblemRepository } from '../infrastructure/database/repositories/PrismaProblemRepository';
// import { PrismaSubmissionRepository } from '../infrastructure/database/repositories/PrismaSubmissionRepository';
// import { PrismaTestCaseRepository } from '../infrastructure/database/repositories/PrismaTestCaseRepository';
// import { JoseAuthTokenService } from '../infrastructure/auth/JoseAuthTokenService';
// import { Argon2PasswordService } from '../infrastructure/auth/Argon2PasswordService';
// import { BullMQQueueService } from '../infrastructure/queue/BullMQQueueService';
// import { RedisCacheService } from '../infrastructure/cache/RedisCacheService';
// import { SocketIOService } from '../infrastructure/websocket/SocketIOService';

// --- Use Cases ---
// import { RegisterUser } from '../application/use-cases/auth/RegisterUser';
// import { LoginUser } from '../application/use-cases/auth/LoginUser';
// import { GetProblems } from '../application/use-cases/problem/GetProblems';
// import { SubmitSolution } from '../application/use-cases/submission/SubmitSolution';

// --- Config ---
// import { prisma } from '../config/database';
// import { redis } from '../config/redis';

// ============================================================
// Wire Dependencies
// ============================================================

// Step 1: Instantiate infrastructure
// const userRepository = new PrismaUserRepository(prisma);
// const problemRepository = new PrismaProblemRepository(prisma);
// const submissionRepository = new PrismaSubmissionRepository(prisma);
// const testCaseRepository = new PrismaTestCaseRepository(prisma);
// const authTokenService = new JoseAuthTokenService();
// const passwordService = new Argon2PasswordService();
// const queueService = new BullMQQueueService(redis);
// const cacheService = new RedisCacheService(redis);
// const notificationService = new SocketIOService();

// Step 2: Instantiate use cases with injected dependencies
// const registerUser = new RegisterUser(userRepository, passwordService, authTokenService);
// const loginUser = new LoginUser(userRepository, passwordService, authTokenService);
// const getProblems = new GetProblems(problemRepository, cacheService);
// const submitSolution = new SubmitSolution(
//   submissionRepository,
//   problemRepository,
//   queueService,
//   notificationService,
// );

// Step 3: Export container
export const container = {
  // Uncomment and add as implementations are ready:
  // repositories: { userRepository, problemRepository, submissionRepository, testCaseRepository },
  // services: { authTokenService, passwordService, queueService, cacheService, notificationService },
  // useCases: { registerUser, loginUser, getProblems, submitSolution },
};
