import { Router } from 'express';
import { z } from 'zod';
import { container } from '../../container';
import { validateRequest } from '../middleware/validate-request';
import { RegisterSchema, LoginSchema } from '@interviewprep/shared-types';

// ============================================================
// Auth Routes
// Registers handlers for auth endpoints with input validations
// ============================================================

const authRoutes = Router();

const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

authRoutes.post(
  '/register',
  validateRequest(RegisterSchema),
  (req, res, next) => {
    container.controllers.authController.register(req, res, next);
  }
);

authRoutes.post(
  '/login',
  validateRequest(LoginSchema),
  (req, res, next) => {
    container.controllers.authController.login(req, res, next);
  }
);

authRoutes.post(
  '/refreshToken',
  validateRequest(RefreshTokenSchema),
  (req, res, next) => {
    container.controllers.authController.refresh(req, res, next);
  }
);

export { authRoutes };
