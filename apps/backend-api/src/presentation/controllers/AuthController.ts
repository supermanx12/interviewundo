import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger';
import type { RegisterUser } from '../../application/use-cases/auth/RegisterUser';
import type { LoginUser } from '../../application/use-cases/auth/LoginUser';
import type { RefreshToken } from '../../application/use-cases/auth/RefreshToken';
import type { AuthenticateGithubUser } from '../../application/use-cases/auth/AuthenticateGithubUser';
import type { AuthenticateGoogleUser } from '../../application/use-cases/auth/AuthenticateGoogleUser';

// ============================================================
// AuthController
// Presentation adapter mapping registration/login endpoints to use cases.
// Every method emits structured log events (attempt / success / failure)
// so auth issues are instantly searchable in your log platform.
// ============================================================

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
    private readonly refreshToken: RefreshToken,
    private readonly authenticateGithubUser: AuthenticateGithubUser,
    private readonly authenticateGoogleUser: AuthenticateGoogleUser,
  ) {}

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    logger.info({ requestId, event: 'auth.refresh.attempt' }, 'Token refresh attempt');
    try {
      const result = await this.refreshToken.execute(req.body);
      logger.info({ requestId, event: 'auth.refresh.success' }, 'Token refresh succeeded');
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.warn(
        { requestId, event: 'auth.refresh.failure', err: (error as Error).message },
        'Token refresh failed',
      );
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    const { email } = req.body;
    logger.info({ requestId, email, event: 'auth.register.attempt' }, 'User registration attempt');
    try {
      const result = await this.registerUser.execute(req.body);
      logger.info(
        { requestId, userId: result.user.id, email, event: 'auth.register.success' },
        'User registered successfully',
      );
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.warn(
        { requestId, email, event: 'auth.register.failure', err: (error as Error).message },
        'User registration failed',
      );
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    const { email } = req.body;
    logger.info({ requestId, email, event: 'auth.login.attempt' }, 'Credential login attempt');
    try {
      const result = await this.loginUser.execute(req.body);
      logger.info(
        { requestId, userId: result.user.id, email, event: 'auth.login.success' },
        'Credential login succeeded',
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.warn(
        { requestId, email, event: 'auth.login.failure', err: (error as Error).message },
        'Credential login failed',
      );
      next(error);
    }
  };

  githubLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    const { githubId, email } = req.body;
    logger.info(
      { requestId, githubId, email, event: 'auth.github.attempt' },
      'GitHub OAuth attempt',
    );
    try {
      const result = await this.authenticateGithubUser.execute(req.body);
      logger.info(
        { requestId, userId: result.user.id, githubId, event: 'auth.github.success' },
        'GitHub OAuth succeeded',
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error(
        { requestId, githubId, email, event: 'auth.github.failure', err: (error as Error).message },
        'GitHub OAuth failed',
      );
      next(error);
    }
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    const { googleId, email } = req.body;
    logger.info(
      { requestId, googleId, email, event: 'auth.google.attempt' },
      'Google OAuth attempt',
    );
    try {
      const result = await this.authenticateGoogleUser.execute(req.body);
      logger.info(
        { requestId, userId: result.user.id, googleId, event: 'auth.google.success' },
        'Google OAuth succeeded',
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error(
        { requestId, googleId, email, event: 'auth.google.failure', err: (error as Error).message },
        'Google OAuth failed',
      );
      next(error);
    }
  };
}
