import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../../domain/errors';

export function authorize(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthorizationError('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AuthorizationError('You do not have permission to access this resource');
    }

    next();
  };
}
