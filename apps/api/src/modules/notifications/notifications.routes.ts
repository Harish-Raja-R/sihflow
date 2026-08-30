import { Router, Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response';
import { optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

let mockNotifications = [
  { id: 'notif-1', title: 'Blocker Alert', message: 'BLK-001 is active on Hyperledger Adapter', type: 'WARNING', isRead: false, createdAt: new Date().toISOString() },
  { id: 'notif-2', title: 'SIH Readiness', message: 'Readiness Index at 86% (Grand Finale Ready)', type: 'SUCCESS', isRead: false, createdAt: new Date().toISOString() },
  { id: 'notif-3', title: 'Test Automation', message: '12/12 integration tests passing with 0 failures', type: 'INFO', isRead: true, createdAt: new Date().toISOString() },
];

// GET /api/v1/notifications
router.get('/', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  return sendSuccess(res, mockNotifications);
});

// PATCH /api/v1/notifications/read-all
router.patch('/read-all', optionalAuthMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  mockNotifications = mockNotifications.map((n) => ({ ...n, isRead: true }));
  return sendSuccess(res, { success: true, message: 'All notifications marked as read' });
});

export const notificationRoutes = router;
