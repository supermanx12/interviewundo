import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env';
import { AuthenticationError } from '../../domain/errors';

// ============================================================
// Shared Secret Middleware
// Validates that the request has the correct server-to-server shared secret header.
// ============================================================

export function validateSharedSecret(req: Request, _res: Response, next: NextFunction): void {
  try {
    const sharedSecret = req.headers['x-auth-shared-secret'];
    if (!sharedSecret || sharedSecret !== env.AUTH_SHARED_SECRET) {
      throw new AuthenticationError('Unauthorized: Shared secret invalid or missing');
    }
    next();
  } catch (error) {
    next(error);
  }
}
