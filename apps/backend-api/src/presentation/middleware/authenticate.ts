import { Request, Response, NextFunction } from 'express';
import { container } from '../../container';
import { AuthenticationError } from '../../domain/errors';

// ============================================================
// Authentication Middleware
// Verifies JWT token and attaches user information to Request
// ============================================================

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Authorization token is missing or malformed');
    }

    const token = authHeader.substring(7);

    // Dynamically retrieve configured AuthTokenService from DI container
    const { services } = container as any;
    if (!services || !services.authTokenService) {
      throw new Error('AuthTokenService is not registered in the dependency injection container');
    }

    const payload = await services.authTokenService.verifyAccessToken(token);

    // Attach verified identity to request context
    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    const { services } = container as any;
    if (!services || !services.authTokenService) {
      throw new Error('AuthTokenService is not registered in the dependency injection container');
    }

    const payload = await services.authTokenService.verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    // Suppress error to allow unauthenticated request to proceed
    next();
  }
}
