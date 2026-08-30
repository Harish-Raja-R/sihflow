import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, role, teamRole, githubUsername, phone, responsibilities } = req.body;
      if (!name || !email || !password || !teamRole) {
        return sendError(res, 'VALIDATION_ERROR', 'Name, email, password, and teamRole are required', 400);
      }

      const result = await AuthService.register({
        name,
        email,
        password,
        role,
        teamRole,
        githubUsername,
        phone,
        responsibilities,
      });

      return sendSuccess(res, result, 201);
    } catch (error: any) {
      if (error.message === 'USER_ALREADY_EXISTS') {
        return sendError(res, 'USER_EXISTS', 'A user with this email already exists', 409);
      }
      return sendError(res, 'REGISTRATION_FAILED', error.message || 'Registration failed', 500);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email) {
        return sendError(res, 'VALIDATION_ERROR', 'Email is required', 400);
      }

      const result = await AuthService.login(email, password);
      return sendSuccess(res, result);
    } catch (error: any) {
      if (error.message === 'INVALID_CREDENTIALS') {
        return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
      }
      return sendError(res, 'LOGIN_FAILED', error.message || 'Login failed', 500);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      }
      const user = await AuthService.getMe(req.user.userId);
      return sendSuccess(res, user);
    } catch (error: any) {
      return sendError(res, 'USER_NOT_FOUND', error.message || 'User not found', 404);
    }
  }

  static async logout(req: Request, res: Response) {
    return sendSuccess(res, { message: 'Logged out successfully' });
  }
}
