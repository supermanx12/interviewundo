import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// ============================================================
// Request ID Middleware
// Injects X-Request-ID header for distributed tracing
// ============================================================

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = (req.headers['x-request-id'] as string) || randomUUID();
  req.headers['x-request-id'] = id;
  res.setHeader('X-Request-ID', id);
  next();
}
