import { Router } from 'express';
import { z } from 'zod';
import { container } from '../../container';
import { validateRequest } from '../middleware/validate-request';
import { validateSharedSecret } from '../middleware/validate-shared-secret';
import { authRefreshLimiter } from '../middleware/rate-limiter';
import { RegisterSchema, LoginSchema } from '@interviewprep/shared-types';

// ============================================================
// Auth Routes
// Registers handlers for auth endpoints with input validations
// ============================================================

const authRoutes = Router();

const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

authRoutes.post('/register', validateRequest(RegisterSchema), (req, res, next) => {
  container.controllers.authController.register(req, res, next);
});

authRoutes.post('/login', validateRequest(LoginSchema), (req, res, next) => {
  container.controllers.authController.login(req, res, next);
});

// Use the lenient refresh limiter here — this endpoint is called automatically
// every ~14 min by the client; the general 100-req limiter would lock users out.
authRoutes.post(
  '/refreshToken',
  authRefreshLimiter,
  validateRequest(RefreshTokenSchema),
  (req, res, next) => {
    container.controllers.authController.refresh(req, res, next);
  },
);

const GithubAuthSchema = z.object({
  githubId: z.string().min(1, 'Github ID is required'),
  email: z.string().email('Invalid email address').toLowerCase(),
  name: z.string().min(1, 'Name is required'),
  image: z.string().nullable().optional(),
});

authRoutes.post(
  '/github',
  validateSharedSecret,
  validateRequest(GithubAuthSchema),
  (req, res, next) => {
    container.controllers.authController.githubLogin(req, res, next);
  },
);

const GoogleAuthSchema = z.object({
  googleId: z.string().min(1, 'Google ID is required'),
  email: z.string().email('Invalid email address').toLowerCase(),
  name: z.string().min(1, 'Name is required'),
  image: z.string().nullable().optional(),
});

authRoutes.post(
  '/google',
  validateSharedSecret,
  validateRequest(GoogleAuthSchema),
  (req, res, next) => {
    container.controllers.authController.googleLogin(req, res, next);
  },
);

export { authRoutes };
