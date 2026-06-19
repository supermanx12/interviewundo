import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../../domain/errors';

// ============================================================
// Request Validation Middleware
// Validates body, query, or params against a Zod schema
// ============================================================

type ValidationTarget = 'body' | 'query' | 'params';

export function validateRequest(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      throw new ValidationError('Validation failed', details);
    }

    // Replace with parsed (and coerced) data
    req[target] = result.data;
    next();
  };
}
