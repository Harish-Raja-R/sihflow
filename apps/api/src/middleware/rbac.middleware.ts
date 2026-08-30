import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'TEAM_LEAD' && req.user.role !== 'ADMIN') {
      return next(
        new ForbiddenError(
          `Action restricted to roles [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
        )
      );
    }

    next();
  };
}

export const requireTeamLead = requireRole('TEAM_LEAD');
export const requireReviewer = requireRole('REVIEWER', 'TEAM_LEAD');
