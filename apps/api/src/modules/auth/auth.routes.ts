import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import { mockStore } from '../../config/mockStore';
import { ENV } from '../../config/env';
import { sendSuccess } from '../../utils/response';
import { UnauthorizedError, ValidationError } from '../../utils/errors';
import { authMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { registerSchema, loginSchema } from '@sihflow/validation';

const router = Router();

// POST /api/v1/auth/register
router.post(
  '/register',
  validateBody(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, teamRole, role } = req.body;

      const userDTO = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role: role || 'TEAM_MEMBER',
        teamRole,
        avatarUrl: null,
      };

      const token = jwt.sign(
        { id: userDTO.id, email: userDTO.email, role: userDTO.role, teamRole: userDTO.teamRole },
        ENV.JWT_SECRET,
        { expiresIn: ENV.JWT_EXPIRES_IN as any }
      );

      return sendSuccess(res, { user: userDTO, token }, 201);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/auth/login
router.post(
  '/login',
  validateBody(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Check against mock members or demo password
      const member = mockStore.members.find((m) => m.email === email);
      if (!member) {
        throw new UnauthorizedError('Invalid email or password');
      }

      if (password !== 'Demo@123') {
        throw new UnauthorizedError('Invalid email or password');
      }

      const token = jwt.sign(
        { id: member.id, email: member.email, role: member.role, teamRole: member.teamRole, name: member.name },
        ENV.JWT_SECRET,
        { expiresIn: ENV.JWT_EXPIRES_IN as any }
      );

      return sendSuccess(res, { user: member, token });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Logged out successfully' });
});

// GET /api/v1/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError('User session expired');
    }
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
});

export const authRoutes = router;
