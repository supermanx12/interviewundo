import { Request, Response, NextFunction } from 'express';
import {
  DomainError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
} from '../../domain/errors';
import { logger } from '../../config/logger';

// ============================================================
// Global Error Handler
// Maps DomainErrors to HTTP status codes
// ============================================================

const errorStatusMap = new Map<string, number>([
  [NotFoundError.name, 404],
  [ValidationError.name, 400],
  [AuthenticationError.name, 401],
  [AuthorizationError.name, 403],
  [ConflictError.name, 409],
]);

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const requestId = req.headers['x-request-id'] as string | undefined;

  if (err instanceof DomainError) {
    const status = errorStatusMap.get(err.constructor.name) ?? 500;

    logger.warn(
      { err: { code: err.code, message: err.message }, requestId, path: req.path },
      'Domain error',
    );

    res.status(status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...('details' in err ? { details: (err as ValidationError).details } : {}),
      },
      requestId,
    });
    return;
  }

  // Unexpected errors — log full stack trace
  logger.error(
    { err, message: err.message, stack: err.stack, requestId, path: req.path },
    'Unhandled error',
  );

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV !== 'production' ? { detail: err.message, stack: err.stack } : {}),
    },
    requestId,
  });
}
