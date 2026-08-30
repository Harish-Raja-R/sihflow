import { Response } from 'express';
import { NotificationService } from '../services/notification.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class NotificationController {
  static async getNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'UNAUTHORIZED', 'Auth required', 401);
      const notifications = await NotificationService.getUserNotifications(req.user.userId);
      return sendSuccess(res, notifications);
    } catch (error: any) {
      return sendError(res, 'FETCH_NOTIFICATIONS_FAILED', error.message, 500);
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = await NotificationService.markAsRead(id);
      return sendSuccess(res, updated);
    } catch (error: any) {
      return sendError(res, 'MARK_READ_FAILED', error.message, 500);
    }
  }

  static async markAllAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'UNAUTHORIZED', 'Auth required', 401);
      await NotificationService.markAllAsRead(req.user.userId);
      return sendSuccess(res, { message: 'All notifications marked as read' });
    } catch (error: any) {
      return sendError(res, 'MARK_ALL_READ_FAILED', error.message, 500);
    }
  }
}
